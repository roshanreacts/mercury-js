import { GraphQLError } from 'graphql';
import type { Mercury } from '../../mercury';
export const handleAddToCartForExistingCart = async (cartId: string, mercury: Mercury, user: any, productItem: string, priceBookItem: string, quantity: number, productPrice: number) => {
  const mercuryInstance = mercury.db
  if (!cartId) {
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

  await recalculateTotalAmountOfCart(cartId, mercury, user)
}


export const recalculateTotalAmountOfCart = async (cart: any, mercury: Mercury, user: any) => {
  const cartItems = await mercury.db.CartItem.list({ cart }, user);
  const totalAmount = cartItems.reduce((amount: number, item: any) => amount + item.amount, 0);
  await mercury.db.Cart.update(cart, { totalAmount }, user);
}

export const syncAddressIsDefault = async (
  customer: string,
  mercury: Mercury,
  user: any
) => {
  const mercuryInstance = mercury.db;
  const existingDefaultAddress = await mercuryInstance.Address.get(
    {
      customer: customer,
      isDefault: true,
    },
    user
  );
  if (existingDefaultAddress.id) {
    await mercuryInstance.Address.update(
      existingDefaultAddress,
      { isDefault: false },
      user,
      { skipHook: true }
    );
  }
};
