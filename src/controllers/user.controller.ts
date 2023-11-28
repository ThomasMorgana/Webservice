import { Request, Response } from 'express';
import { Role, User } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/user.service';
import { UserSchema } from '../utils/validator_schemas';

export default class UserController {
  private userService: UserService;

  constructor(service: UserService) {
    this.userService = service;
  }
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content cannot be empty!',
      });
    }
    try {
      UserSchema.parse(req.body);
      const savedUser = await this.userService.register(req.body);

      res.status(StatusCodes.CREATED).send(savedUser);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async createAdmin(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Content cannot be empty!',
        });
      }

      const currentUserRole = req.role;

      if (currentUserRole !== Role.ADMIN) {
        return res.status(StatusCodes.FORBIDDEN).send({
          message: 'You must be an Admin to create an Admin',
        });
      }

      UserSchema.parse(req.body);
      const user: User = req.body;
      user.role = Role.ADMIN;
      const savedUser = await this.userService.register(user);

      res.status(StatusCodes.CREATED).send(savedUser);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async activateAccount(req: Request, res: Response) {
    const token = req.query.token as string;

    if (!token) return res.status(StatusCodes.BAD_REQUEST).send('PLease provide the activation token as parameter');

    try {
      await this.userService.activateAccount(token);
      res.status(StatusCodes.OK).send('activated');
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await this.userService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(users);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const user = await this.userService.retrieveById(id);
      if (user) {
        res.status(StatusCodes.OK).send(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`User not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      UserSchema.parse(req.body);
      const userToUpdate: User = req.body;
      userToUpdate.id = req.params.id;
      const user = await this.userService.update(userToUpdate);
      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      await this.userService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `User deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
