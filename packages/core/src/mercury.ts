import { merge } from 'lodash';
import { historySchema } from './utility';
import { Model } from './models';
import hook from './hooks';
class Mercury {
  list: Array<TModel> = [];
  db: {
    [modelName: string]: Model;
  } = {};

  public createModel(name: string, fields: TFields, options: TOptions): void {
    const defaultOptions = {
      historyTracking: true,
      private: false,
    };
    options = merge(defaultOptions, options);
    const model: TModel = { name, fields, options };
    if (options.private) {
      return;
    }
    hook.execBefore('CREATE_MODEL', model, () => {
      console.log('CREATE_MODEL hook executed', model);
    });
    this.list.push(model);
    this.db[name] = new Model(name);
    // if historyTracking is true, create a history model
    if (options.historyTracking) {
      const historyModel: TModel = {
        name: `${name}History`,
        fields: historySchema(name),
      };
      this.list.push(historyModel);
      this.db[name] = new Model(historyModel.name);
    }
  }
}

const mercury: Mercury = new Mercury();
export default mercury;
