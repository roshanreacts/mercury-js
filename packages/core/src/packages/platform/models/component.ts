import mercury from "src/mercury";

export class Component {
    constructor() {
        this.subscribeHooks();
        this.createComponent();
    }
    private createComponent() {
        mercury.createModel(
            'Component',
            {
                name: {
                    type: 'string',
                    required: true,
                },
                label: {
                    type: 'string',
                    required: true,
                },
                description: {
                    type: 'string',
                    required: true,
                },
                code: {
                    type: 'string',
                    required: true,
                },
                modules: {
                    type: 'string',
                    required: true,
                    many: true
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
        mercury.hook.after("DELETE_COMPONENT_HOOK", async function (this: any) {

        })
        mercury.hook.before("DELETE_COMPONENT_HOOK", async function (this: any) {

        })
    }
    private updateComponentHook() {
        const _self = this;
        mercury.hook.after("UPDATE_COMPONENT_HOOK", async function (this: any) {

        })
        mercury.hook.before("UPDATE_COMPONENT_HOOK", async function (this: any) {

        })
    }
    private createComponentHook() {
        const _self = this;
        mercury.hook.after("CREATE_COMPONENT_HOOK", async function (this: any) {

        })
        mercury.hook.before("CREATE_COMPONENT_HOOK", async function (this: any) {

        })
    }



}