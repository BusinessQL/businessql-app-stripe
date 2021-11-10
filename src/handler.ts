import { Integration } from './integrations';
import { addCustomerHandler, AddCustomerEvent } from './stripe/add-customer';
import { customersHandler, CustomersEvent } from './stripe/customers';
import {
  removeCustomerHandler,
  RemoveCustomerEvent,
} from './stripe/remove-customer';
import {
  updateCustomerHandler,
  UpdateCustomerEvent,
} from './stripe/update-customer';

export interface HandlerEvent {
  body: EventBody;
  headers: {
    [key: string]: string;
  };
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  query: any;
  path: string;
}

export interface EventBody {
  method: string;
  payload?: any;
  integration?: Integration;
}

export type HandlerContext = {
  statusCode: number;
  headerValues: {
    [key: string]: string;
  };
  cbCalled: number;
  status: (status: number) => HandlerContext;
  headers: (value: { [key: string]: string }) => HandlerContext;
  succeed: (value: any) => HandlerContext;
  fail: (value: any) => HandlerContext;
};

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const { method } = event.body;

    switch (method) {
      case 'customers':
        return customersHandler(event as CustomersEvent, context);

      case 'addCustomer':
        return addCustomerHandler(event as AddCustomerEvent, context);

      case 'updateCustomer':
        return updateCustomerHandler(event as UpdateCustomerEvent, context);

      case 'removeCustomer':
        return removeCustomerHandler(event as RemoveCustomerEvent, context);

      default:
        break;
    }

    throw new Error(`Invalid method: ${method}`);
  } catch (error: any) {
    return context.status(500).fail(error.message || 'Failed');
  }
};

export default handler;
