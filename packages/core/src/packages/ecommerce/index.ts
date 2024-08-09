import type { Mercury } from '../../mercury';
import type { Platform } from '../../packages/platform';
import { AfterHook } from '../platform/utility';
import { Cart, Catalog, Category, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, Product, ProductAttribute, ProductItem, User } from './models';

export interface EcommerceConfig {
  options?: any;
}

export default (config?: EcommerceConfig) => {
  return async (platform: Platform) => {
    const ecommerce = new Ecommerce(platform);
    ecommerce.createModels();
  };
};

class Ecommerce {
  public platform: Platform;
  constructor(platform: Platform) {
    this.platform = platform;
  }


  // check the flow 
  // async createModels() {
  //   await this.platform.createModel({
  //     info: { name: "User", label: "User", description: "User model", managed: true, prefix: "USR" },
  //     fields: User,
  //     options: { historyTracking: false }
  //   });
  // }
  // @AfterHook()
  async createModels() {
    const models = [Product, Cart, Catalog, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, ProductAttribute, ProductItem, Category];
    const modelCreation = models.map(model => this.platform.createModel(model));
    await Promise.all(modelCreation);
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
}