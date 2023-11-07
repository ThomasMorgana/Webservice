import Stripe from 'stripe';
import { logger } from '../utils/logger';

class StripeClient {
  public stripe: Stripe;

  constructor(private apiKey: string) {
    this.stripe = new Stripe(apiKey, { typescript: true });
  }

  async createPaymentIntent(
    subscriptionId: string,
    amount: number,
    currency: string,
    paymentMethodOptions?: object,
  ): Promise<Stripe.PaymentIntent> {
    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      payment_method_types: ['card'],
      metadata: {
        subscriptionId,
      },
    };

    if (paymentMethodOptions) {
      params.payment_method_options = paymentMethodOptions;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create(params);
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw new Error('Stripe payment intent creation failed');
    }
  }
}

const stripeClient = new StripeClient(process.env.STRIPE_SECRET_TEST as string);

export default stripeClient;
