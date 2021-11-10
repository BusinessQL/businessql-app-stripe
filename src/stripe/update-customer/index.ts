import { EventBody, HandlerEvent, HandlerContext } from '../../handler';
import { updateCustomer } from '..';

export interface UpdateCustomerEvent extends HandlerEvent {
  body: UpdateCustomersEventBody;
}

export interface UpdateCustomersEventBody extends EventBody {
  payload: {
    secretKey: string;
    customerId: string;
    data: any;
  };
}

export const updateCustomerHandler = async (
  event: UpdateCustomerEvent,
  context: HandlerContext
) => {
  const { secretKey, customerId, data } = event.body.payload;

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

  return context.status(200).succeed({ customer });
};
