import type { Mercury } from '../../../mercury';

export class LayoutStructure {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.subscribeHooks();
    this.createLayoutStructure();
  }
  private createLayoutStructure() {
    this.mercury.createModel(
      'LayoutStructure',
      {
        layout: {
          type: 'relationship',
          ref: 'Layout',
          required: true,
        },
        component: {
          type: 'relationship',
          ref: 'Component',
          required: true,
        },
        order: {
          type: "number",
          required: true
        },
        row: {
          type: "number"
        },
        col: {
          type: "number",
        },
      },
      {
        historyTracking: false,
        indexes: [
          {
            fields: {
              layout: 1,
              order: 1,
            },
            options: {
              unique: true,
            },
          },
        ]
      }
    );
  }
  private subscribeHooks() {
    this.createLayoutStructureHook();
    this.updateLayoutStructureHook();
    this.deleteLayoutStructureHook();
  }
  private deleteLayoutStructureHook() {
    const _self = this;
    this.mercury.hook.after('DELETE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
    this.mercury.hook.before('DELETE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
  }
  private updateLayoutStructureHook() {
    const _self = this;
    this.mercury.hook.after('UPDATE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
    this.mercury.hook.before('UPDATE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
  }
  private createLayoutStructureHook() {
    const _self = this;
    this.mercury.hook.after('CREATE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
    this.mercury.hook.before('CREATE_LAYOUTSTRUCTURE_HOOK', async function (this: any) { });
  }
}
