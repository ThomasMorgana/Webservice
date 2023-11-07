import { Request, Response } from 'express';
import subscriptionService from '../services/subscription.service';
import { Subscription, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';

export default class SubscriptionController {
  async create(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).send({
          message: 'You need to pass the userId',
        });
      }

      const { userId } = req.body;

      const savedSubscription = await subscriptionService.save(userId);

      res.status(201).send(savedSubscription);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error! Something went wrong while creating the subscription',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const subscriptions = await subscriptionService.retrieveAll(req.query as Pagination);
      res.status(200).send(subscriptions);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error! Something went wrong getting the subscriptions',
      });
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
      res.status(500).send({
        message: 'Internal Server Error!',
      });
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Subscription with id=${subscriptionToUpdate.id} not found`,
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
        res.status(500).send({
          message: 'Internal Server Error!',
        });
      }
    }
  }
}
