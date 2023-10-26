import { Request, Response } from 'express';
import userService from '../services/user.services';
import { Prisma, Role, User } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export default class UserController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });

      return;
    }
    try {
      const savedUser = await userService.register(req.body);
      res.status(201).send(savedUser);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async createAdmin(req: Request, res: Response) {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });
      return;
    }
    try {
      const user: User = req.body;
      const currentUserRole: Role = (req as AuthenticatedRequest).role;

      if (currentUserRole != Role.ADMIN) {
        res.status(403).send({
          message: 'You must be an Admin to create an Admin',
        });
        return;
      }

      user.role = Role.ADMIN;
      const savedUser = await userService.register(user);
      res.status(201).send(savedUser);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await userService.retrieveAll(req.query as Pagination);
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;
    try {
      const user = await userService.retrieveById(id);
      res.status(user ? 200 : 400).send(user ? user : `User with id=${id} not found`);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async update(req: Request, res: Response) {
    const userToUpdate: User = req.body;
    userToUpdate.id = req.params.id;
    try {
      const user = await userService.update(userToUpdate);
      res.status(200).send(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `User with id=${userToUpdate.id} not found`,
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error!',
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;
    try {
      await userService.delete(id);
      res.status(200).send({
        message: `User with id=${id} deleted`,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `User with id=${id} not found`,
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error!',
        });
      }
    }
  }
}
