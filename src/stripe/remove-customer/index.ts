import { Request, Response } from 'express';
import { removeCustomer } from '../utils';

export type RemoveCustomerPayload = {
  secretKey: string;
  customerId: string;
};

export const removeCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { secretKey, customerId } = req.body.payload as RemoveCustomerPayload;

    if (!secretKey) {
      throw new Error('Missing secretKey');
    }

    if (!customerId) {
      throw new Error('Missing customerId');
    }

    const { removed } = await removeCustomer({
      secretKey,
      customerId,
    });

    return res.json({ removed });
  } catch (error) {
    return res.json({ removed: false });
  }
};
