import { Prisma, PrismaClient, Subscription } from '@prisma/client';
import StripeClient from '../clients/stripe.client';
import { Stripe } from 'stripe';
import Pagination from '../interfaces/pagination.interface';
import { logger } from '../utils/logger';
import { BadRequestError, CodedError, EntityNotFoundError, InternalServerError } from '../errors/base.error';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class SubscriptionRepository {
  constructor(private prisma: PrismaClient) {}

  async save(userId: string): Promise<Subscription> {
    try {
      const subscription = await this.prisma.subscription.create({
        data: {
          active: false,
          user: { connect: { id: userId } },
        },
      });

      try {
        await StripeClient.createPaymentIntent(subscription.id, StatusCodes.INTERNAL_SERVER_ERROR, 'eur');
        return subscription;
      } catch (stripeError) {
        await this.delete(subscription.id);
        throw new InternalServerError(stripeError);
      }
    } catch (prismaError) {
      throw new InternalServerError(prismaError);
    }
  }

  async handleWebhook(body: string, signature: string) {
    let event: Stripe.Event;
    try {
      event = StripeClient.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
      throw new CodedError(`⚠️  Webhook signature verification failed.`, StatusCodes.INTERNAL_SERVER_ERROR, err);
    }

    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    switch (eventType) {
      case 'payment_intent.succeeded':
        const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;

        const { subscriptionId } = pi.metadata;
        if (!subscriptionId) throw new BadRequestError('No Subscription Id Defined');

        const subscription = await this.prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!subscription) throw new EntityNotFoundError('Subscription', subscriptionId);

        subscription.active = true;

        try {
          const updatedSubscription = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: subscription,
          });

          if (!updatedSubscription) throw new InternalServerError();

          logger.info(`The subscription ${subscription.id} for user with ${subscription.userId} has been activated`);
        } catch (error) {
          throw new InternalServerError();
        }
        break;

      case 'payment_intent.payment_failed':
        logger.info('A payment failed', data);
        break;

      default:
        logger.info('Unsupported Callback Status on stripe webhook');
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<Subscription[]> {
    const { page = 0, step = 10 } = pagination || {};
    try {
      const subscriptions = await this.prisma.subscription.findMany({
        take: +step,
        skip: +step * +page,
        orderBy: { id: 'asc' },
      });
      return subscriptions;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveById(id: string): Promise<Subscription | null> {
    try {
      return this.prisma.subscription.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Subscription', id);
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async update(subscription: Subscription): Promise<Subscription> {
    try {
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { ...subscription },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Subscription', subscription.id);
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const result = await this.prisma.subscription.delete({ where: { id }, select: { id: true } });
      return result.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Subscription', id);
      } else {
        throw new InternalServerError(error);
      }
    }
  }
}

export default new SubscriptionRepository(prisma);
