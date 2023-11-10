import { PrismaClient, Prisma, User } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import bcryptjs from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  ActivationTokenInvalidError,
  IncorrectPasswordError,
  MailAlreadyUsedError,
  MailNotFoundError,
  UserNotFoundError,
} from '../errors/auth.error';
import mailService from './mail.service';
import { generateActivationToken } from '../utils/jwt';
import { EntityNotFoundError, InternalServerError } from '../errors/base.error';

const prisma = new PrismaClient();

class UserService {
  async login(credentials: Prisma.UserCreateInput): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      throw new MailNotFoundError();
    }

    const isPasswordValid = bcryptjs.compareSync(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new IncorrectPasswordError();
    }

    return user;
  }

  async register(credentials: Prisma.UserCreateInput): Promise<User> {
    let newUser = null;
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: credentials.email,
        },
      });

      if (existingUser) {
        throw new MailAlreadyUsedError();
      }

      newUser = await prisma.user.create({
        data: {
          ...credentials,
        },
      });

      const activationToken = await generateActivationToken(newUser);

      await mailService.onRegister(newUser, activationToken);

      return newUser;
    } catch (error) {
      if (newUser) this.delete(newUser.id);
      if (error instanceof MailAlreadyUsedError) throw error;
      throw new InternalServerError(error);
    }
  }

  async activateAccount(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET as string) as JwtPayload;
    if (!decoded.id) throw new ActivationTokenInvalidError();

    const user = await this.retrieveById(decoded.id);
    if (!user) throw new UserNotFoundError();

    user.active = true;

    try {
      return await this.update(user);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<User[]> {
    const page = pagination?.page || 0;
    const step = pagination?.step || 10;

    const users = await prisma.user.findMany({
      take: +step,
      skip: +step * +page,
      orderBy: { id: 'asc' },
    });

    return users;
  }

  async retrieveById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async retrieveByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('User', email);
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async update(user: User): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: user.id },
        data: { ...user },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('User', user.id);
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const deletedUser = await prisma.user.delete({ where: { id } });
      return deletedUser.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('User', id);
      } else {
        throw new InternalServerError(error);
      }
    }
  }
}

export default new UserService();
