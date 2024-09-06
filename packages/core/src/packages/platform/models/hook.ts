import type { Mercury } from '../../../mercury';
import _ from 'lodash';
import { AfterHook, Utility } from '../utility';
import { TModel, TOptions, TMetaModel, Rule } from '../../../../types';

export class Hook {
  protected mercury: Mercury;
  protected utility;
  
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createModel();
    this.subscribeHooks();
  }

  private createModel() {
    this.mercury.createModel(
      'Hook',
      {
        model: {
          type: 'relationship',
          ref: 'Model',
        },
        modelName: {
          type: 'string',
        },
        enableBeforeCreate: {
          type: 'boolean',
          default: false,
        },
        beforeCreate: {
          type: 'string',
        },
        enableAfterCreate: {
          type: 'boolean',
          default: false,
        },
        afterCreate: {
          type: 'string',
        },
        enableBeforeUpdate: {
          type: 'boolean',
          default: false,
        },
        beforeUpdate: {
          type: 'string',
        },
        enableAfterUpdate: {
          type: 'boolean',
          default: false,
        },
        afterUpdate: {
          type: 'string',
        },
        enableBeforeDelete: {
          type: 'boolean',
          default: false,
        },
        beforeDelete: {
          type: 'string',
        },
        enableAfterDelete: {
          type: 'boolean',
          default: false,
        },
        afterDelete: {
          type: 'string',
        },
        enableBeforeGet: {
          type: 'boolean',
          default: false,
        },
        beforeGet: {
          type: 'string',
        },
        enableAfterGet: {
          type: 'boolean',
          default: false,
        },
        afterGet: {
          type: 'string',
        },
        enableBeforeList: {
          type: 'boolean',
          default: false,
        },
        beforeList: {
          type: 'string',
        },
        enableAfterList: {
          type: 'boolean',
          default: false,
        },
        afterList: {
          type: 'string',
        },
        createdBy: {
          type: 'relationship',
          ref: 'User',
        },
        updatedBy: {
          type: 'relationship',
          ref: 'User',
        },
      },
      {
        historyTracking: false
      }
    );
  }

  private subscribeHooks() {
    this.createMetaHookHook();
    this.updateMetaHookHook();
    this.deleteMetaHookHook();
  }

  // CREATE Hook
  private createMetaHookHook() {
    const _self = this;
    this.mercury.hook.before('CREATE_HOOK_HOOK', async function (this: any) {
      // before create logic
    });
    this.mercury.hook.after('CREATE_HOOK_HOOK', async function (this: any) {
      // after create logic
    });
  }

  // UPDATE Hook
  private updateMetaHookHook() {
    const _self = this;
    this.mercury.hook.before('UPDATE_HOOK_HOOK', async function (this: any) {
      // before update logic
    });
    this.mercury.hook.after('UPDATE_HOOK_HOOK', async function (this: any) {
      // after update logic
    });
  }

  // DELETE Hook
  private deleteMetaHookHook() {
    const _self = this;
    this.mercury.hook.before('DELETE_HOOK_HOOK', async function (this: any) {
      // before delete logic
    });
    this.mercury.hook.after('DELETE_HOOK_HOOK', async function (this: any) {
      // after delete logic
    });
  }
}
