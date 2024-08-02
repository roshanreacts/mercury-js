import type { Mercury } from '../../mercury';
import type { Platform } from '../../packages/platform';

export interface EcommerceConfig {
  platform: Platform;
}

export default (config: EcommerceConfig) => {
  return (mercury: Mercury) => {
    const ecommerce = new Ecommerce(mercury, config.platform);
    ecommerce.createModels();
  };
};

class Ecommerce {
  public mercury: Mercury;
  public platform: Platform;
  constructor(mercury: Mercury, platform: Platform) {
    this.mercury = mercury;
    this.platform = platform;
  }

  createModels() {
    console.log("Inside ecommerce")
    
    // this.platform.createModel();
  }
}