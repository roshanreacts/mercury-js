import { Mercury } from '../../mercury';

export interface MercuryRecordOwnerPkgConfig {
  recordOwner: boolean;
}

export default (config?: MercuryRecordOwnerPkgConfig) => {
  return (mercury: Mercury) => {
    if (!config) {
      config = {
        recordOwner: false,
      };
    }
    mercury.hook.before('CREATE_MODEL', function (this: any) {
      if (this.options.recordOwner) {
        this.fields = {
          ...this.fields,
          createdBy: {
            type: 'relationship',
            ref: 'User',
          },
          updatedBy: {
            type: 'relationship',
            ref: 'User',
          },
          owner: {
            type: 'relationship',
            ref: 'User',
          },
        };

        mercury.hook.before(
          `CREATE_${this.name.toUpperCase()}_RECORD`,
          function (this: any) {
            this.data['createdBy'] = this.user.id;
            this.data['updatedBy'] = this.user.id;
            this.data['owner'] = this.user.id;
          }
        );

        mercury.hook.before(
          `UPDATE_${this.name.toUpperCase()}_RECORD`,
          function (this: any) {
            this.data['updatedBy'] = this.user.id;
          }
        );
      }
    });
  };
};
