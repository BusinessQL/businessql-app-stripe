import { Request, Response } from 'express';
import { getCustomers } from '../utils';

export type GetCustomersPayload = {
  secretKey: string;
};

export const getCustomersHandler = async (req: Request, res: Response) => {
  const { secretKey } = req.body.payload as GetCustomersPayload;

  if (!secretKey) {
    throw new Error('Missing secretKey');
  }

  const { customers } = await getCustomers({ secretKey });

  return res.json({ customers });
};
