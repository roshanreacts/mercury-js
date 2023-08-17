import { merge } from 'lodash';
import { historySchema } from './utility';
import { Model } from './models';
import hook from './hooks';

// Define a class for the Mercury ORM
class Mercury {
  // Initialize an empty array for storing models
  list: Array<TModel> = [];

  // Initialize an empty object for storing models by name
  db: {
    [modelName: string]: Model;
  } = {};

  // Create a new model with the specified name, fields, and options
  public createModel<ModelType>(
    name: string,
    fields: TFields,
    options: TOptions
  ): void {
    // Define default options for the model
    const defaultOptions = {
      historyTracking: true,
      private: false,
    };

    // Merge the specified options with the default options
    options = merge(defaultOptions, options);

    // Create a new model object with the specified name, fields, and options
    const model: TModel = { name, fields, options };

    // If the model is private, do not add it to the list of models
    if (options.private) {
      return;
    }

    // Execute the CREATE_MODEL hook before creating the model
    hook.execBefore('CREATE_MODEL', model, (error: any) => {
      if (error) {
        throw error;
      }
    });

    // Add the model to the list of models
    this.list.push(model);

    // Create a new Model instance for the model and add it to the database
    this.db[name] = new Model(model);

    // If historyTracking is true, create a history model for the model
    if (options.historyTracking) {
      const historyModel: TModel = {
        name: `${name}History`,
        fields: historySchema(name),
      };
      this.list.push(historyModel);
      this.db[name] = new Model({
        name: historyModel.name,
        fields: historyModel.fields,
        options: { historyTracking: false },
      });
    }
  }
}

// Create a new instance of the Mercury class and export it
const mercury: Mercury = new Mercury();
export default mercury;
