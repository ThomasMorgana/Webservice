import { Request, Response } from 'express';
import subscriptionService from '../services/subscription.service';
import { Subscription } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';

export default class SubscriptionController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content can not be empty!',
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'You must send the userId!',
      });
    }

    try {
      const savedSubscription = await subscriptionService.save(userId);

      res.status(StatusCodes.CREATED).send(savedSubscription);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(subscriptions);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      const subscription = await subscriptionService.retrieveById(id);
      if (subscription) {
        res.status(StatusCodes.OK).send(subscription);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`Subscription with id=${id} not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  }

  handleStripeHook(req: Request, res: Response) {
    try {
      subscriptionService.handleWebhook(req.body, (req.headers['stripe-signature'] as string) || '');
      return res.sendStatus(StatusCodes.OK);
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).send(err);
    }
  }

  async update(req: Request, res: Response) {
    const subscriptionToUpdate: Subscription = req.body;
    subscriptionToUpdate.id = req.params.id;

    try {
      const subscription = await subscriptionService.update(subscriptionToUpdate);
      res.status(StatusCodes.OK).send(subscription);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    const id: string = req.params.id;

    try {
      await subscriptionService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Subscription with id=${id} deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
