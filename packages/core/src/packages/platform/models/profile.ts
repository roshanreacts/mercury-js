import type { Mercury } from '../../../mercury';

export class Profile {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
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
    this.mercury.hook.after("CREATE_PROFILE_RECORD", async function (this: any) {
      if (this.options.skipHook) return;
      const record = await _self.mercury.db.Profile.get(
        { _id: this.record._id },
        { id: '1', profile: 'Admin' },
        { select: "name" }
      );
      await _self.mercury.cache.set(record.name, JSON.stringify([]));
    })
  }
}