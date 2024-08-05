import type { Mercury } from '../../mercury';
import type { Platform } from '../../packages/platform';
import { Cart, Catalog, Coupon, Market, Order, Payment, PriceBook, PriceBookItem, Product, ProductAttribute, ProductItem, User } from './models';

export interface EcommerceConfig {
  options?: any;
}

export default (config?: EcommerceConfig) => {
  return (platform: Platform) => {
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
  async createModels() {
    await this.platform.createModel(Product)
    await this.platform.createModel(User)
    await this.platform.createModel(Cart)
    await this.platform.createModel(Catalog)
    await this.platform.createModel(Coupon)
    await this.platform.createModel(Market)
    await this.platform.createModel(Order)
    await this.platform.createModel(Payment)
    await this.platform.createModel(PriceBook)
    await this.platform.createModel(PriceBookItem)
    await this.platform.createModel(ProductAttribute)
    await this.platform.createModel(ProductItem)
  }
}