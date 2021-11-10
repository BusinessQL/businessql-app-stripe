import Stripe from 'stripe';

export const getStripeClient = ({ secretKey }: { secretKey: string }) => {
  return new Stripe(secretKey, {
    apiVersion: '2020-08-27',
  });
};
