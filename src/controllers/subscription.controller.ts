import { Request, Response } from 'express';
import { Subscription } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';
import SubscriptionService from '../services/subscription.service';

export default class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor(service: SubscriptionService) {
    this.subscriptionService = service;
  }

  create = async (req: Request, res: Response) => {
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
      const savedSubscription = await this.subscriptionService.save(userId);

      res.status(StatusCodes.CREATED).send(savedSubscription);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const subscriptions = await this.subscriptionService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(subscriptions);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findOne = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
      const subscription = await this.subscriptionService.retrieveById(id);
      if (subscription) {
        res.status(StatusCodes.OK).send(subscription);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`Subscription not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  };

  handleStripeHook = (req: Request, res: Response) => {
    try {
      this.subscriptionService.handleWebhook(req.body, (req.headers['stripe-signature'] as string) || '');
      return res.sendStatus(StatusCodes.OK);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    const subscriptionToUpdate: Subscription = req.body;
    subscriptionToUpdate.id = req.params.id;

    try {
      const subscription = await this.subscriptionService.update(subscriptionToUpdate);
      res.status(StatusCodes.OK).send(subscription);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
      await this.subscriptionService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Subscription deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };
}
