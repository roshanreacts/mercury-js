
import type { Platform } from '../../packages/platform';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { Address, Cart, CartItem, Collection, Category, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, Product, ProductAttribute, ProductItem, Customer } from './models';
import { handleAddToCartForExistingCart, recalculateTotalAmountOfCart } from './utils';
import { GraphQLError } from 'graphql';
//@ts-ignore
import jwt from 'jsonwebtoken';
import mercury from 'src/mercury';

export interface EcommerceConfig {
  options?: any;
  plugins?: any;
}

export default (config?: EcommerceConfig) => {
  return async (platform: Platform) => {
    const ecommerce = new Ecommerce(platform, config?.plugins);
    ecommerce.createModels();
    ecommerce.cartHooks();
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
    const models = [Address, Product, Cart, Customer, Collection, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, ProductAttribute, ProductItem, Category, CartItem];
    const modelCreation = models.map(model => this.platform.createModel(model));
    await Promise.all(modelCreation);
    this.platform.mercury.addGraphqlSchema(`
      type Mutation {
            login(email: String!, password: String!, cartToken: String): loginResponse
            signUp(email: String!, password: String!, firstName: String!, lastName: String!, profile: String, mobile: String): Response
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
          signUp: async (root: any, { email, password, firstName, lastName, profile, mobile }: { email: string, mobile: string, password: string, firstName: string, lastName: string, profile: string }, ctx: any) => {
            const mercuryDBInstance = this.platform.mercury.db;
            const customer = await mercuryDBInstance.Customer.create({
              email,
              firstName,
              lastName,
              password,
              profile,
              mobile
            }, ctx?.user);
            await mercuryDBInstance.Cart.create({
              customer: customer._id,
              totalAmount: 0
            }, ctx?.user);
            return {
              id: customer._id,
              msg: "Signup successful"
            }
          },
          login: async (root: any, { email, password, cartToken }: { email: string, password: string, cartToken: string }, ctx: any) => {
            const mercuryDBInstance = this.platform.mercury.db;
            const customer = await mercuryDBInstance.Customer.get({ email }, ctx.user);
            if (!customer) {
              throw new GraphQLError('Invalid email or password');
            }
            const isPasswordValid = await customer.verifyPassword(password);
            if (!isPasswordValid) {
              throw new GraphQLError('Invalid email or password');
            }
            const token = jwt.sign({ id: customer._id, email: customer.email }, "JWT_SECRET", { expiresIn: '2d' });

            const cart = await mercuryDBInstance.Cart.get({ cartToken, customer: customer?._id }, ctx.user);

            if (!cart?.id && cartToken) {
              const anonymousCart = await mercuryDBInstance.Cart.get({ cartToken }, ctx.user);
              if (anonymousCart.id) {
                const anonymousCartItemList = await mercuryDBInstance.CartItem.list({ cart: anonymousCart?.id }, ctx.user);
                const customerCart = await mercuryDBInstance.Cart.get({ customer: customer?._id }, ctx.user);
                const customerCartItemList = await mercuryDBInstance.CartItem.list({ cart: customerCart?.id }, ctx.user);
                const customerCartItemMap = new Map<string, any>();
                customerCartItemList.forEach((item: any) => {
                  const key = `${item.productItem.toString()}_${item.priceBookItem.toString()}`;
                  customerCartItemMap.set(key, item);
                });

                for (const anonItem of anonymousCartItemList) {
                  const key = `${anonItem.productItem.toString()}_${anonItem.priceBookItem.toString()}`;

                  if (customerCartItemMap.has(key)) {
                    const existingItem = customerCartItemMap.get(key);
                    existingItem.quantity += anonItem.quantity;
                    existingItem.amount += anonItem.amount;

                    await mercuryDBInstance.CartItem.update(existingItem._id, {
                      quantity: existingItem.quantity,
                      amount: existingItem.amount
                    }, ctx.user, { skipHook: true });
                    await mercuryDBInstance.CartItem.delete(anonItem._id, ctx.user);
                  } else {
                    anonItem.cart = customerCart._id;
                    await mercuryDBInstance.CartItem.update(anonItem._id, anonItem, ctx.user, { skipHook: true });
                  }
                }
                await mercuryDBInstance.Cart.delete(anonymousCart._id, ctx.user);
              }
            }

            return {
              id: customer._id,
              profile: customer.profile,
              session: token
            };
          }
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


  async cartHooks() {
    const thisPlatform = this.platform;
    this.platform.mercury.hook.before('UPDATE_CARTITEM_RECORD', async function (this: any) {
      if (!this.options.skipHook) {
        const quantity = this.options?.args?.input?.quantity;
        const cartItem = await thisPlatform.mercury.db.CartItem.get({ _id: this.options?.args?.input?.id }, this?.user, {
          populate: [
            {
              path: "priceBookItem"
            },
          ]
        })
        this.options.args.input.amount = (quantity * cartItem?.priceBookItem?.offerPrice) || 0;
      }
    })

    this.platform.mercury.hook.after('UPDATE_CARTITEM_RECORD', async function (this: any) {
      const cartItem = await thisPlatform.mercury.db.CartItem.get({_id: this?.record?.id}, this.user);
      await recalculateTotalAmountOfCart(cartItem?.cart, thisPlatform.mercury, this.user);
    })

    this.platform.mercury.hook.after('CREATE_CARTITEM_RECORD', async function (this: any) {      
      const cartItem = await thisPlatform.mercury.db.CartItem.get({_id: this?.record?.id}, this.user);
      await recalculateTotalAmountOfCart(cartItem?.cart, thisPlatform.mercury, this.user);
    })

    this.platform.mercury.hook.after('DELETE_CARTITEM_RECORD', async function (this: any) {      
      await recalculateTotalAmountOfCart(this?.deletedRecord?.cart, thisPlatform.mercury, this.user);
    })
  }
  async paymentHooks() {
    const Payment = this.platform.mercury.db.Payment;
    this.platform.mercury.hook.after('UPDATE_PAYMENT_RECORD', async function (this: any) {
      console.log("Handle Orders Creation")
    })
  }
}
