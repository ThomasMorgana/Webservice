import { Request, Response } from 'express';
import subscriptionService from '../services/subscription.service';
import { Subscription, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';

export default class SubscriptionController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        message: 'You must send the userId!',
      });
    }

    try {
      const savedSubscription = await subscriptionService.save(userId);

      res.status(201).send(savedSubscription);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.retrieveAll(req.query as Pagination);
      res.status(200).send(subscriptions);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const subscription = await subscriptionService.retrieveById(id);
      if (subscription) {
        res.status(200).send(subscription);
      } else {
        res.status(404).send(`Subscription with id=${id} not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  }

  handleStripeHook(req: Request, res: Response) {
    try {
      subscriptionService.handleWebhook(req.body, (req.headers['stripe-signature'] as string) || '');
      return res.sendStatus(200);
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async update(req: Request, res: Response) {
    const subscriptionToUpdate: Subscription = req.body;
    subscriptionToUpdate.id = req.params.id;

    try {
      const subscription = await subscriptionService.update(subscriptionToUpdate);
      res.status(200).send(subscription);
    } catch (error) {
      //TODO: move these to the service
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Subscription with id=${subscriptionToUpdate.id} not found`,
        });
      } else {
        errorHandler(res, error);
      }
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      await subscriptionService.delete(id);
      res.status(200).send({
        message: `Subscription with id=${id} deleted`,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Subscription with id=${id} not found`,
        });
      } else {
        errorHandler(res, error);
      }
    }
  }
}
