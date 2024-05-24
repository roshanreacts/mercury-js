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
        profiles: {
          type: 'relationship',
          ref: 'Profile',
          many: true,
        },
        name: {
          type: 'string',
          required: true,
        },
        label: {
          type: 'string',
          required: true,
        },
        structures: {
          type: 'virtual',
          ref: 'LayoutStructure',
          localField: "_id",
          foreignField:"layout",
          many: true,
        },

      },
      {
        historyTracking: false,
      }
    );
  }
  private subscribeHooks() {
    this.createLayoutHook();
    this.updateLayoutHook();
    this.deleteLayoutHook();
  }
  private deleteLayoutHook() {
    const _self = this;
    this.mercury.hook.after('DELETE_LAYOUT_HOOK', async function (this: any) {});
    this.mercury.hook.before('DELETE_LAYOUT_HOOK', async function (this: any) {});
  }
  private updateLayoutHook() {
    const _self = this;
    this.mercury.hook.after('UPDATE_LAYOUT_HOOK', async function (this: any) {});
    this.mercury.hook.before('UPDATE_LAYOUT_HOOK', async function (this: any) {});
  }
  private createLayoutHook() {
    const _self = this;
    this.mercury.hook.after('CREATE_LAYOUT_HOOK', async function (this: any) {});
    this.mercury.hook.before('CREATE_LAYOUT_HOOK', async function (this: any) {});
  }
}
