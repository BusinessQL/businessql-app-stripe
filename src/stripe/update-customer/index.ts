import { Request, Response } from 'express';
import { updateCustomer } from '../utils';

export type UpdateCustomerPayload = {
  secretKey: string;
  customerId: string;
  data: unknown;
};

export const updateCustomerHandler = async (req: Request, res: Response) => {
  const { secretKey, customerId, data } = req.body
    .payload as UpdateCustomerPayload;

  if (!secretKey) {
    throw new Error('Missing secretKey');
  }

  if (!customerId) {
    throw new Error('Missing customerId');
  }

  if (!data) {
    throw new Error('Missing data');
  }

  const { customer } = await updateCustomer({
    secretKey,
    customerId,
    data,
  });

  return res.json({ customer });
};
