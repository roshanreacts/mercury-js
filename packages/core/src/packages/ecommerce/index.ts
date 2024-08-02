import type { Mercury } from '../../mercury';
import type { Platform } from '../../packages/platform';

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
  async createModels() {
    await this.platform.createModel({
      info: { name: "Testmodel", label: "testmodel", description: "desc", managed: false, prefix: "prefio" }, fields: {
        name: {
          type: 'string'
        }
      }, options: { historyTracking: false }
    });
  }
}