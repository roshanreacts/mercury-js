
import type { Platform } from '../../packages/platform';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { Address, Cart, CartItem, Collection, Category, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, Product, ProductAttribute, ProductItem, User } from './models';
import { handleAddToCartForExistingCart } from './utils';

export interface EcommerceConfig {
  options?: any;
  plugins?: any;
}

export default (config?: EcommerceConfig) => {
  return async (platform: Platform) => {
    const ecommerce = new Ecommerce(platform, config?.plugins);
    ecommerce.createModels();
    await ecommerce.installPlugins();
  };
};

export class Ecommerce {
  public platform: Platform;
  public plugins: Array<(commerce: Ecommerce) => void> = [];;
  constructor(platform: Platform, plugins: any = []) {
    this.platform = platform;
    this.plugins = plugins;
  }

  async installPlugins() {
    await Promise.all(this.plugins.map(pkg => pkg(this as Ecommerce)));
  }

  async createModels() {
    const models = [Address, Product, Cart, Collection, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, ProductAttribute, ProductItem, Category, CartItem];
    const modelCreation = models.map(model => this.platform.createModel(model));
    await Promise.all(modelCreation);
    this.platform.mercury.addGraphqlSchema(`
      type Mutation {
            login(email: String, password: String): loginResponse
            signUp(email: String, password: String, firstName: String, lastName: String, profile: String): Response
            addCartItem(cartToken: String, productItem:String!,priceBookItem:String!,customer:String,quantity:Int!, productPrice: Int!): AddCartItemResponse
          }
      type loginResponse {
            id: String,
            profile: String,
            session: String,
          }
  
          type Response {
            id: String
            msg: String
          }
        type AddCartItemResponse {
          message: String,
          cartToken: String
        }
      `,
      {
        Mutation: {
          addCartItem: async (
            root: any,
            {
              cartToken,
              productItem,
              priceBookItem,
              customer,
              quantity,
              productPrice
            }: {
              cartToken: string;
              priceBookItem: string;
              productItem: string;
              customer: string;
              quantity: number;
              productPrice: number;
            },
            ctx: any
          ) => {
            const mercuryInstance = this.platform.mercury.db;
            const cartItemSchema = mercuryInstance.CartItem.mongoModel;
            let newToken = '';
            if (!cartToken && !customer) {
              const token = await uuidv4();
              const cart = await mercuryInstance.Cart.create(
                {
                  cartToken: token,
                },
                ctx.user
              );
              await cartItemSchema.create({
                cart: cart._id,
                amount: (productPrice || 0) * quantity,
                productItem,
                priceBookItem,
                quantity,
              });
              newToken = token;
            } else if (!customer && cartToken) {
              const cart = await mercuryInstance.Cart.get({ cartToken }, ctx.user);
              await handleAddToCartForExistingCart(cart._id, this.platform.mercury, ctx.user, productItem, priceBookItem, quantity, productPrice)
            }
            else if (customer) {
              const cart = await mercuryInstance.Cart.get({ customer }, ctx.user);
              await handleAddToCartForExistingCart(cart._id, this.platform.mercury, ctx.user, productItem, priceBookItem, quantity, productPrice)
            }
            return {
              message: "Product added successfully to the cart",
              cartToken: newToken || null
            };
          },
        }
      }
    )
    await new Promise((resolve, reject) => {
      this.platform.mercury.hook.execAfter(
        `PLATFORM_INITIALIZE`,
        {},
        [],
        function (error: any) {
          if (error) {
            // Reject the Promise if there is an error
            reject(error);
          } else {
            // Resolve the Promise if there is no error
            resolve(true);
          }
        }
      );
    });
  }

  async paymentHooks() {
    const Payment = this.platform.mercury.db.Payment;
    this.platform.mercury.hook.after('UPDATE_PAYMENT_RECORD', async function (this: any) {
      console.log("Handle Orders Creation")
    })
  }
}
