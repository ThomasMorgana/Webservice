import { PrismaClient, Prisma, User } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import bcryptjs from 'bcryptjs';
import { IncorrectPasswordError, MailAlreadyUsedError, MailNotFoundError } from '../errors/auth.error';
import mailService from './mail.service';

const prisma = new PrismaClient();
class UserService {
  async login(credentials: Prisma.UserCreateInput): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user) throw new MailNotFoundError();
    if (!bcryptjs.compareSync(credentials.password, user.password)) throw new IncorrectPasswordError();

    return user;
  }

  async register(credentials: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (user) throw new MailAlreadyUsedError();

    const newUser = await prisma.user.create({
      data: {
        ...credentials,
      },
    });

    mailService.onRegister(newUser);

    return newUser;
  }

  async retrieveAll(pagination?: Pagination): Promise<User[]> {
    if (pagination?.page) {
      const page = pagination.page ?? 0;
      const step = pagination.step ?? 10;
      return await prisma.user.findMany({ take: +step, skip: +step * +page, orderBy: { id: 'asc' } });
    } else {
      return await prisma.user.findMany();
    }
  }

  async retrieveById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id: id } });
  }

  async retrieveByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email: email } });
  }

  async update(user: User): Promise<User> {
    return await prisma.user.update({
      where: { id: user.id },
      data: { ...user },
    });
  }

  async delete(id: string): Promise<string> {
    return (await prisma.user.delete({ where: { id: id }, select: { id: true } })).id;
  }
}

export default new UserService();
