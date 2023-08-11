import { historySchema } from './utility';
import { Model } from './models';
class Mercury {
  list: Array<TModel> = [];
  db: {
    [modelName: string]: Model;
  } = {};

  public createModel(name: string, fields: TFields, options: TOptions): void {
    const model: TModel = { name, fields };
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
