import { MIMEType } from 'util';
import type { Mercury } from '../../../mercury';

export class File {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.subscribeHooks();
    this.createFile();
  }
  private createFile() {
    this.mercury.createModel(
      "File",
      {
        name:{
            type:"string"
        },
				description:{
					type:"string"
			},
        mimeType:{
            type:"string"
        },
        extension:{
            type:"string"
        },
        size:{
            type:"number"
        },
        location:{
            type:"string"
        },
      },
      {
        historyTracking: false,
      }
    )
  }
  private subscribeHooks() {
    this.createFileHook();
    this.updateFileHook();
    this.deleteFileHook();
  }
  private deleteFileHook() {
    const _self = this;
    this.mercury.hook.after("DELETE_FILE_HOOK", async function (this: any) {

    })
    this.mercury.hook.before("DELETE_FILE_HOOK", async function (this: any) {

    })
  }
  private updateFileHook() {
    const _self = this;
    this.mercury.hook.after("UPDATE_FILE_HOOK", async function (this: any) {

    })
    this.mercury.hook.before("UPDATE_FILE_HOOK", async function (this: any) {

    })
  }
  private createFileHook() {
    const _self = this;
    this.mercury.hook.after("CREATE_FILE_HOOK", async function (this: any) {

    })
    this.mercury.hook.before("CREATE_FILE_HOOK", async function (this: any) {

    })
  }

}