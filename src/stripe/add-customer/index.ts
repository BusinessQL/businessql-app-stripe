import { Request, Response } from 'express';
import { createCustomer } from '../utils';

export type AddCustomerPayload = {
  secretKey: string;
  name: string;
  email: string;
  metadata?: any;
};

export const addCustomerHandler = async (req: Request, res: Response) => {
  const { secretKey, name, email, metadata } = req.body
    .payload as AddCustomerPayload;

  if (!secretKey) {
    throw new Error('Missing secretKey');
  }

  if (!name) {
    throw new Error('Missing name');
  }

  if (!email) {
    throw new Error('Missing email');
  }

  const { customer } = await createCustomer({
    secretKey,
    name,
    email,
    metadata,
  });

  return res.json({ customer });
};
