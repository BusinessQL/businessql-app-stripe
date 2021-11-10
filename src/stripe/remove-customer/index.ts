import { EventBody, HandlerEvent, HandlerContext } from '../../handler';
import { removeCustomer } from '..';

export interface RemoveCustomerEvent extends HandlerEvent {
  body: RemoveCustomersEventBody;
}

export interface RemoveCustomersEventBody extends EventBody {
  payload: {
    secretKey: string;
    customerId: string;
  };
}

export const removeCustomerHandler = async (
  event: RemoveCustomerEvent,
  context: HandlerContext
) => {
  try {
    const { secretKey, customerId } = event.body.payload;

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

    return context.status(200).succeed({ removed });
  } catch (error) {
    return context.status(200).succeed({ removed: false });
  }
};
