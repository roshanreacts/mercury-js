import type { Mercury } from '../../../mercury';

export class User {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.createUser();
  }
  private createUser() {
    this.mercury.createModel(
      "User",
      {
        firstName: {
          type: 'string',
          required: true,
        },
        lastName: {
          type: 'string',
          required: true,
        },
        email: {
          type: 'string',
          required: true,
          unique: true,
        },
        profile: {
          type: 'relationship',
          ref: 'Model',
          required: true,
        },
        password: {
          type: 'string'
        },
      },
      {
        historyTracking: true,
      }
    )
  }
}