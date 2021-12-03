import { Request, Response } from 'express';
import { addCustomerHandler } from './stripe/add-customer';
import { getCustomersHandler } from './stripe/get-customers';
import { removeCustomerHandler } from './stripe/remove-customer';
import { updateCustomerHandler } from './stripe/update-customer';

export const main = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;

    switch (action) {
      case 'getCustomers':
        return getCustomersHandler(req, res);
      case 'addCustomer':
        return addCustomerHandler(req, res);
      case 'updateCustomer':
        return updateCustomerHandler(req, res);
      case 'removeCustomer':
        return removeCustomerHandler(req, res);
      default:
        break;
    }
    throw new Error(`Invalid action: ${action}`);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed' });
  }
};
