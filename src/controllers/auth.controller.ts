import { Request, Response } from 'express';
import userService from '../services/user.service';
import bcryptjs from 'bcryptjs';
import { RefreshToken } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import resetTokenService from '../services/reset-token.service';
import mailService from '../services/mail.service';
import { errorHandler } from '../utils/error_handler';

export default class AuthController {
  async login(req: Request, res: Response) {
    try {
      if (!req.body.password || !req.body.email) {
        return res.status(400).send('Password and email must be present and not empty');
      }

      const user = await userService.login({ email: req.body.email, password: req.body.password });

      if (!user) {
        return res.status(404).send("Those credentials don't match any users");
      }

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      res.status(200).send({ user, token: accessToken, refreshToken });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async register(req: Request, res: Response) {
    try {
      if (!req.body.password || !req.body.email) {
        return res.status(400).send('Password and email must be present and not empty');
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 12);
      const user = await userService.register({ email: req.body.email, password: hashedPassword });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(200).send({ user, token: accessToken, refreshToken });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async generateRefreshToken(req: Request, res: Response) {
    const refreshToken: string = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).send('Please send the refreshToken in the body');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as RefreshToken;
      const user = await userService.retrieveById(decoded.id);

      if (!user) {
        return res.status(404).send('This refresh token did not match any users');
      }

      res.status(200).send({
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async generateResetToken(req: Request, res: Response) {
    const userEmail = req.body.email;

    if (!userEmail) {
      return res.status(400).send('Please send the user email in the body');
    }

    const user = await userService.retrieveByEmail(userEmail);

    if (user) {
      const resetToken = await resetTokenService.generate(user.id);
      mailService.onPasswordReset(user, resetToken.hashedToken);
    }

    res.status(200).send('If the email matches one of our accounts, an email has been sent with the reset token');
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).send('Please send the token and the password');
    }

    try {
      const user = await resetTokenService.getUserFromToken(token);
      const updatedUser = await userService.update({ ...user, password: await bcryptjs.hash(password, 12) });
      res.status(200).send(updatedUser);
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
