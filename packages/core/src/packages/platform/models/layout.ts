import type { Mercury } from '../../../mercury';

export class Layout {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.subscribeHooks();
    this.createLayout();
  }
  private createLayout() {
    this.mercury.createModel(
      'Layout',
      {
        model: {
          type: 'relationship',
          ref: 'Model',
          required: true,
        },
        modelName: {
          type: 'string',
          required: true,
        },
        viewType: {
          type: 'enum',
          enum: ['Record', 'List'],
          enumType: 'string',
          default: 'Record',
          required: true,
        },
        createdBy: {
          type: 'relationship',
          ref: 'User',
          // required: true,
        },
        updatedBy: {
          type: 'relationship',
          ref: 'User',
          // required: true,
        },
      },
      {
        historyTracking: false,
      }
    );
  }
  private subscribeHooks() {
    this.createComponentHook();
    this.updateComponentHook();
    this.deleteComponentHook();
  }
  private deleteComponentHook() {
    const _self = this;
    this.mercury.hook.after('DELETE_COMPONENT_HOOK', async function (this: any) {});
    this.mercury.hook.before('DELETE_COMPONENT_HOOK', async function (this: any) {});
  }
  private updateComponentHook() {
    const _self = this;
    this.mercury.hook.after('UPDATE_COMPONENT_HOOK', async function (this: any) {});
    this.mercury.hook.before('UPDATE_COMPONENT_HOOK', async function (this: any) {});
  }
  private createComponentHook() {
    const _self = this;
    this.mercury.hook.after('CREATE_COMPONENT_HOOK', async function (this: any) {});
    this.mercury.hook.before('CREATE_COMPONENT_HOOK', async function (this: any) {});
  }
}
