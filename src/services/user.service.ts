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
    const existingUser = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (existingUser) {
      throw new MailAlreadyUsedError();
    }

    const newUser = await prisma.user.create({
      data: {
        ...credentials,
      },
    });

    const activationToken = await generateActivationToken(newUser);

    mailService.onRegister(newUser, activationToken);

    return newUser;
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
      throw new Error("Erreur lors de l'activation du compte");
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
    return await prisma.user.findUnique({ where: { email } });
  }

  async update(user: User): Promise<User> {
    return await prisma.user.update({
      where: { id: user.id },
      data: { ...user },
    });
  }

  async delete(id: string): Promise<string> {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return deletedUser.id;
  }
}

export default new UserService();
