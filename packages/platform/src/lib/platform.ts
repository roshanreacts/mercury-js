import mercury, { Mercury } from '@mercury-js/core';
import { cloneDeep } from 'lodash';
import { Config, TPlugin, PermissionsSet, ILogger } from '../types';
import { Logger } from './logger';

export class Platform {
  private _meta = cloneDeep(mercury);
  private _core = cloneDeep(mercury);
  private _plugins: TPlugin[] = [];
  private _permissions: PermissionsSet = {};
  private _dbUri: string;
  private _logger: ILogger;

  set permissions(value: PermissionsSet) {
    this._permissions = value;
  }

  core(pluginName: string): Promise<Mercury> {
    return new Promise((resolve, reject) => {
      if (this._permissions[pluginName].core) {
        resolve(this._core);
      } else {
        this._logger.error('Access Denied');
        reject('Access Denied');
      }
    });
  }

  constructor(
    config: Config = {
      uri: process.env['MONGODB_URL'] || 'mongodb://localhost:27017',
      logger: new Logger({
        name: 'Mercury',
        namespace: ['Mercury'],
        level: ['debug', 'info', 'warn', 'error'],
      }),
    }
  ) {
    if (config.plugins) this._plugins = config.plugins;

    this._dbUri = config.uri;
    this._logger = config.logger;
    this._meta.connect(this._dbUri); // Connect to the database
    this._core.connect(this._dbUri); // Connect to the database
  }
  run() {
    this._logger.debug('Loading plugins');
    this._plugins.forEach((plugin) => {
      this._logger.debug(`Initializing plugin: ${plugin.name}`);
      plugin.init({ core: this.core(plugin.name) });
    });
  }
}
