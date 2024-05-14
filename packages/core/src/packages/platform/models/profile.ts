import type { Mercury } from '../../../mercury';

export class Profile {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.createProfile();
  }
  private createProfile() {
    this.mercury.createModel(
      "Profile",
      {
        name: {
          type: 'string',
          required: true,
        },
        label: {
          type: 'string',
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
}