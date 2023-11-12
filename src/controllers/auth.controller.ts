import { Request, Response } from 'express';
import UserService from '../services/user.service';
import bcryptjs from 'bcryptjs';
import { RefreshToken } from '@prisma/client';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import resetTokenService from '../services/reset-token.service';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { EntityNotFoundError } from '../errors/base.error';
import ResetTokenService from '../services/reset-token.service';
import MailService from '../services/mail.service';

export default class AuthController {
  private userService: UserService;
  private resetTokenService: ResetTokenService;
  private mailService: MailService = new MailService();

  constructor(userService: UserService, resetTokenService: resetTokenService) {
    this.userService = userService;
    this.resetTokenService = resetTokenService;
  }

  async login(req: Request, res: Response) {
    if (!req.body.password || !req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).send('Password and email must be present and not empty');
    }
    try {
      const user = await this.userService.login({ email: req.body.email, password: req.body.password });

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send("Those credentials don't match any users");
      }

      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      res.status(StatusCodes.OK).send({ user, token: accessToken, refreshToken });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async register(req: Request, res: Response) {
    if (!req.body.password || !req.body.email) {
      return res.status(StatusCodes.BAD_REQUEST).send('Password and email must be present and not empty');
    }
    try {
      const hashedPassword = await bcryptjs.hash(req.body.password, 12);
      const { user, activationToken } = await this.userService.register({
        email: req.body.email,
        password: hashedPassword,
      });

      await this.mailService.onRegister(user, activationToken);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(StatusCodes.OK).send({ user, token: accessToken, refreshToken });
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async generateRefreshToken(req: Request, res: Response) {
    const refreshToken: string = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).send('Please send the refreshToken in the body');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as RefreshToken;
      const user = await this.userService.retrieveById(decoded.id);

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).send('This refresh token did not match any users');
      }

      res.status(StatusCodes.OK).send({
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
      return res.status(StatusCodes.BAD_REQUEST).send('Please send the user email in the body');
    }

    try {
      const user = await this.userService.retrieveByEmail(userEmail);

      if (!user) return logger.error('User not found when generating reset token');

      const resetToken = await this.resetTokenService.generate(user.id);
      await this.mailService.onPasswordReset(user, resetToken.hashedToken);
    } catch (error) {
      // We don't want to let the user know that the account does not exists
      if (error instanceof EntityNotFoundError) {
        logger.error(error);
      } else {
        errorHandler(res, error);
      }
    }

    res
      .status(StatusCodes.OK)
      .send('If the email matches one of our accounts, an email has been sent with the reset token');
  }

  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(StatusCodes.BAD_REQUEST).send('Please send the token and the password');
    }

    try {
      const user = await this.resetTokenService.getUserFromToken(token);
      const updatedUser = await this.userService.update({ ...user, password: await bcryptjs.hash(password, 12) });
      res.status(StatusCodes.OK).send(updatedUser);
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
