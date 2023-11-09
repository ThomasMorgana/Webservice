import Stripe from 'stripe';
import { CodedError } from '../errors/base.error';
import { StatusCodes } from 'http-status-codes';

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
      return await this.stripe.paymentIntents.create(params);
    } catch (error) {
      throw new CodedError('Stripe payment intent creation failed', StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}

const stripeClient = new StripeClient(process.env.STRIPE_SECRET_TEST as string);

export default stripeClient;
