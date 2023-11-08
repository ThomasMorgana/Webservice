import { PrismaClient, Subscription } from '@prisma/client';
import StripeClient from '../clients/stripe.client';
import { Stripe } from 'stripe';
import Pagination from '../interfaces/pagination.interface';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class SubscriptionService {
  constructor(private prisma: PrismaClient) {}

  async save(userId: string): Promise<Subscription> {
    const subscription: Subscription = await this.prisma.subscription.create({
      data: {
        active: false,
        user: { connect: { id: userId } },
      },
    });

    try {
      await StripeClient.createPaymentIntent(subscription.id, 5000, 'eur');
      return subscription;
    } catch (error) {
      this.delete(subscription.id);
      logger.error('Payment Intent creation failed with error :', error);
      throw error;
    }
  }

  async handleWebhook(body: string, signature: string) {
    let event: Stripe.Event;
    try {
      event = StripeClient.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
      logger.error(`⚠️  Webhook signature verification failed.`, err);
      throw new Error('A webhook signature verification failed');
    }

    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    switch (eventType) {
      case 'payment_intent.succeeded':
        const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
        const { subscriptionId } = pi.metadata;
        if (!subscriptionId) throw new Error('No Subscription Id Defined');

        const subscription = await this.prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!subscription) throw new Error('No Subscription found');

        subscription.active = true;
        const updatedSubscription = this.prisma.subscription.update({
          where: { id: subscriptionId },
          data: subscription,
        });
        if (!updatedSubscription) throw new Error('Error while updating subscription');

        logger.info(`The subscription ${subscription.id} for user with ${subscription.userId} has been activated`);
        break;

      case 'payment_intent.payment_failed':
        logger.info('A payment failed', data);
        break;

      default:
        logger.error('Unsupported Callback Status on stripe webhook');
        throw new Error('Unsupported Callback Status');
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<Subscription[]> {
    const { page = 0, step = 10 } = pagination || {};
    const subscriptions = await this.prisma.subscription.findMany({
      take: +step,
      skip: +step * +page,
      orderBy: { id: 'asc' },
    });
    return subscriptions;
  }

  async retrieveById(id: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  async update(subscription: Subscription): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { ...subscription },
    });
  }

  async delete(id: string): Promise<string> {
    const result = await this.prisma.subscription.delete({ where: { id }, select: { id: true } });
    return result.id;
  }
}

export default new SubscriptionService(prisma);
