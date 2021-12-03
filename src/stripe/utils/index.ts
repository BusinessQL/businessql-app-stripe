import Stripe from 'stripe';

export const getStripeClient = ({ secretKey }: { secretKey: string }) => {
  return new Stripe(secretKey, {
    apiVersion: '2020-08-27',
  });
};

export const getCustomers = async ({
  secretKey,
}: {
  secretKey: string;
}): Promise<{ customers: Stripe.Customer[] }> => {
  const stripe = getStripeClient({ secretKey });
  const result = await stripe.customers.list();
  const customers = result.data;

  return { customers };
};

export const createCustomer = async ({
  secretKey,
  name,
  email,
  metadata,
}: {
  secretKey: string;
  name: string;
  email: string;
  metadata?: any;
}): Promise<{ customer: Stripe.Customer }> => {
  const stripe = getStripeClient({ secretKey });
  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  });

  return { customer };
};

export const updateCustomer = async ({
  secretKey,
  customerId,
  data,
}: {
  secretKey: string;
  customerId: string;
  data: any;
}): Promise<{ customer: Stripe.Customer }> => {
  const stripe = getStripeClient({ secretKey });
  const customer = await stripe.customers.update(customerId, data);

  return { customer };
};

export const removeCustomer = async ({
  secretKey,
  customerId,
}: {
  secretKey: string;
  customerId: string;
}): Promise<{ removed: boolean }> => {
  const stripe = getStripeClient({ secretKey });
  const { deleted: removed } = await stripe.customers.del(customerId);

  return { removed };
};
