import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';
import bcryptjs from 'bcryptjs';
import { RefreshToken } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { IncorrectPasswordError, MailAlreadyUsedError, MailNotFoundError } from '../errors/auth.error';

export default class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.password || !req.body.email) {
        res.status(400).send('Password and email must be present and not empty');
        return next();
      }

      const user = await userService.login({ email: req.body.email, password: req.body.password });
      if (!user) {
        res.status(404).send("Those credentials don't match any users");
      } else {
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        res.status(200).send({ user: user, token: accessToken, refreshToken: refreshToken });
      }
    } catch (error) {
      if (error instanceof MailNotFoundError || error instanceof IncorrectPasswordError) {
        res.status(404).send({
          message: "Those credentials don't match any users",
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error! Something went wrong while login in',
        });
      }
    }
    next();
  }

  async register(req: Request, res: Response) {
    try {
      if (!req.body.password || !req.body.email) res.status(401).send();

      const hashedPassword = await bcryptjs.hash(req.body.password, 12);
      const user = await userService.register({ email: req.body.email, password: hashedPassword });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.status(200).send({ user: user, token: accessToken, refreshToken: refreshToken });
    } catch (error) {
      if (error instanceof MailAlreadyUsedError) {
        res.status(409).send({
          message: 'An account with this email already exists, try login in !',
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error! Something went wrong while login in',
        });
      }
    }
  }

  async generateRefreshToken(req: Request, res: Response) {
    const refreshToken: string = req.body.refreshToken;

    if (!refreshToken) return res.status(401).send('Please send the refreshToken in the body');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as RefreshToken;

    const user = await userService.retrieveById(decoded.id);

    if (!user) return res.status(404).send('This refresh token did not match any users');

    res.status(200).send({
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    });
  }
}
