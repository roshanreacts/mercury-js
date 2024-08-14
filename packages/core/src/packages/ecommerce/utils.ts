import { GraphQLError } from 'graphql';
import type { Mercury } from '../../mercury';
export const handleAddToCartForExistingCart = async (cartId: string, mercury: Mercury, user: any, productItem: string, priceBookItem: string, quantity: number, productPrice: number) => {
  const mercuryInstance = mercury.db
  if(!cartId){
    throw new GraphQLError("Something went wrong")
  }
  const cartItem = await mercuryInstance.CartItem.get(
    {
      cart: cartId,
      productItem,
      priceBookItem,
    },
    user
  );
  const newQty = cartItem?.id ? (cartItem.quantity + quantity) : quantity;
  await mercuryInstance.CartItem.mongoModel.updateOne(
    {
      cart: cartId,
      productItem,
      priceBookItem,
    },
    {
      $set: {
        quantity: newQty,
        amount: (productPrice || 0) * newQty
      }
    },
    {
      upsert: true
    }
  );
}