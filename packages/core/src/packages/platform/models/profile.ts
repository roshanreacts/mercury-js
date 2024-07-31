import type { Mercury } from '../../../mercury';
import { Utility } from "../utility";
export class Profile {
  protected mercury: Mercury;
  protected utility;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createProfile();
    this.subscribeHooks();
  }
  private createProfile() {
    this.mercury.createModel(
      "Profile",
      {
        name: {
          type: 'string',
          required: true,
          unique: true
        },
        label: {
          type: 'string',
          required: true,
          unique: true
        },
        permissions: {
          type: 'virtual',
          ref: 'Permission',
          localField: '_id',
          foreignField: 'profile',
          many: true,
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
    this.createProfileHook();
  }
  private createProfileHook() {
    const _self = this;
    this.mercury.hook.before("CREATE_PROFILE_RECORD", async function (this: any) {
      if (this.options.skipHook) return;
      this.data.name = _self.utility.titleCase(this.data.name);
    })
    this.mercury.hook.after("CREATE_PROFILE_RECORD", async function (this: any) {
      // create meta models default read access
      if (this.options.skipHook) return;
      const record = await _self.mercury.db.Profile.get(
        { _id: this.record._id },
        { id: '1', profile: 'SystemAdmin' },
        { select: "name" }
      );
      await _self.mercury.cache.set(record.name, JSON.stringify([]));
    })
  }
}

// two approaches
//1. dont crreate permission records for meta mdoels
//2.create permissionj recorsd for meta odels
