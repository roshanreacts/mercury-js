export default (mercury: Mercury): void => {
  mercury.createList('UserMock', {
    fields: {
      name: {
        type: 'string',
        isRequired: true,
      },
      email: {
        type: 'string',
        isRequired: true,
      },
      password: {
        type: 'string',
        isRequired: true,
      },
      role: {
        type: 'enum',
        enumType: 'string',
        enum: ['SUPERADMIN', 'ADMIN', 'USER'],
        isRequired: true,
      },
    },
  })
}
