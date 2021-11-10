import { EventBody, HandlerEvent, HandlerContext } from '../../handler';
import { createCustomer } from '..';

export interface AddCustomerEvent extends HandlerEvent {
  body: AddCustomersEventBody;
}

export interface AddCustomersEventBody extends EventBody {
  payload: {
    secretKey: string;
    name: string;
    email: string;
    metadata?: any;
  };
}

export const addCustomerHandler = async (
  event: AddCustomerEvent,
  context: HandlerContext
) => {
  const { secretKey, name, email, metadata } = event.body.payload;

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

  return context.status(200).succeed({ customer });
};
