import mercury from "src/mercury";

export class Tab {
    constructor() {
        this.subscribeHooks();
        this.createTab();
    }
    private createTab() {
        mercury.createModel(
            "Tab",
            {
                icon: {
                    type: 'string',
                    required: true,
                },
                model: {
                    type: 'relationship',
                    ref: 'Model',
                    required: true,
                },
                label: {
                    type: 'string',
                    required: true,
                },
                order: {
                    type: 'number',
                    required: true,
                },
                createdBy: {
                    type: 'relationship',
                    ref: 'User',
                },
                updatedBy: {
                    type: 'relationship',
                    ref: 'User'
                },
            },
            {
                historyTracking: false,
            }
        )
    }
    private subscribeHooks() {
        this.createTabHook();
        this.updateTabHook();
        this.deleteTabHook();
    }
    private deleteTabHook() {
        const _self = this;
        mercury.hook.after("DELETE_TAB_HOOK", async function (this: any) {

        })
        mercury.hook.before("DELETE_TAB_HOOK", async function (this: any) {

        })
    }
    private updateTabHook() {
        const _self = this;
        mercury.hook.after("UPDATE_TAB_HOOK", async function (this: any) {

        })
        mercury.hook.before("UPDATE_TAB_HOOK", async function (this: any) {

        })
    }
    private createTabHook() {
        const _self = this;
        mercury.hook.after("CREATE_TAB_HOOK", async function (this: any) {

        })
        mercury.hook.before("CREATE_TAB_HOOK", async function (this: any) {

        })
    }

}