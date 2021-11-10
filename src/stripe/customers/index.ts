import { EventBody, HandlerEvent, HandlerContext } from '../../handler';
import { getCustomers } from '..';

export interface CustomersEvent extends HandlerEvent {
  body: CustomersEventBody;
}

export interface CustomersEventBody extends EventBody {
  payload: {
    secretKey: string;
  };
}

export const customersHandler = async (
  event: CustomersEvent,
  context: HandlerContext
) => {
  const { secretKey } = event.body.payload;

  if (!secretKey) {
    throw new Error('Missing secretKey');
  }

  const { customers } = await getCustomers({ secretKey });

  return context.status(200).succeed({ customers });
};
