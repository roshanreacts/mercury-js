import Generate from '../../src/Generate'
import Resolvers from '../../src/Resolvers'
import {
  TodoSchema,
  TodoGql,
  UserSchema,
  UserGql,
  baseTypedefs,
} from '../sampleModel.mock'

describe('Resolver Test', () => {
  const defaultAccessUserKey = [
    'firstName',
    'lastName',
    'todosCount',
    'password',
    'isAdmin',
    'role',
    'todos',
    'todosVirtual',
  ]
  let resolvers: any
  const roles: Array<string> = ['ADMIN', 'USER', 'ANONYMOUS']
  const hookFunc = jest.fn()

  beforeAll(() => {
    const generate = new Generate(
      {
        _model: 'User',
        ...UserSchema,
        access: {
          default: false,
          acl: [{ USER: () => ({ read: ['firstName'] }) }],
        },
        hooks: {
          beforeCreate: hookFunc,
          afterCreate: hookFunc,
          beforeUpdate: hookFunc,
          afterUpdate: hookFunc,
          beforeDelete: hookFunc,
          afterDelete: hookFunc,
        },
      },
      {
        adminRole: 'ADMIN',
        roles,
        adapter: 'mongoose',
        path: './',
        schemaList: [],
      }
    )
    resolvers = new Resolvers(generate)
  })
  it('should compose where input to schema', () => {
    const input = {
      id: {
        isNot: '687y787g637ge3e3y7823e',
      },
      firstName: {
        startsWith: 'Roshan',
      },
      todosCount: { gt: 1 },
    }
    const getWhereSchema = resolvers.whereInputMap(input)
    expect(getWhereSchema).toStrictEqual({
      _id: { $ne: '687y787g637ge3e3y7823e' },
      firstName: {
        $regex: '^Roshan',
        $options: 'i',
      },
      todosCount: {
        $gt: 1,
      },
    })
  })
  it('should generate where input to schema with and or', () => {
    const inputWithAndOr = {
      AND: [
        {
          OR: [
            {
              id: {
                isNot: '687y787g637ge3e3y7823e',
              },
            },
            {
              firstName: {
                startsWith: 'Roshan',
              },
            },
          ],
        },
        {
          OR: [
            {
              id: {
                isNot: '687y787g637ge3e3y7823e',
              },
            },
            {
              firstName: {
                startsWith: 'Roshan',
              },
            },
          ],
        },
      ],
    }

    const input = {
      id: {
        isNot: '687y787g637ge3e3y7823e',
      },
      firstName: {
        startsWith: 'Roshan',
      },
      todosCount: { gt: 1 },
    }
    const getWhereSchemaWithAndOr = resolvers.whereInputCompose(inputWithAndOr)
    const getWhereSchema = resolvers.whereInputCompose(input)
    expect(getWhereSchemaWithAndOr).toStrictEqual({
      $and: [
        {
          $or: [
            { _id: { $ne: '687y787g637ge3e3y7823e' } },
            { firstName: { $regex: '^Roshan', $options: 'i' } },
          ],
        },
        {
          $or: [
            { _id: { $ne: '687y787g637ge3e3y7823e' } },
            { firstName: { $regex: '^Roshan', $options: 'i' } },
          ],
        },
      ],
    })
    expect(getWhereSchema).toStrictEqual({
      _id: { $ne: '687y787g637ge3e3y7823e' },
      firstName: {
        $regex: '^Roshan',
        $options: 'i',
      },
      todosCount: {
        $gt: 1,
      },
    })
  })
  it('should validate the access acl', async () => {
    const accessMatrix = await resolvers.validateAccess('read', {
      ctx: { user: { role: 'USER' } },
    })
    expect(accessMatrix).toStrictEqual(['firstName'])
  })

  it('should merge the access acl', async () => {
    const access = await resolvers.mergeAcl('USER')
    const defaultAcl = {
      default: false,
      acl: { read: true, create: false, update: false, delete: false },
      accessList: {
        read: ['firstName'],
        create: [],
        update: [],
        delete: [],
      },
    }
    expect(access).toStrictEqual(defaultAcl)
  })
  it('should validate the access acl', () => {
    const access = resolvers.generateDefaultAcl(true)
    const accessFalsy = resolvers.generateDefaultAcl(false)
    const defaultAcl = {
      default: true,
      acl: [
        {
          ADMIN: { read: true, create: true, update: true, delete: true },
        },
        { USER: { read: true, create: true, update: true, delete: true } },
        { ANONYMOUS: { read: true, create: true, update: true, delete: true } },
      ],
    }
    const defaultAclFalsy = {
      default: false,
      acl: [
        {
          ADMIN: { read: true, create: true, update: true, delete: true },
        },
        { USER: { read: false, create: false, update: false, delete: false } },
        {
          ANONYMOUS: {
            read: false,
            create: false,
            update: false,
            delete: false,
          },
        },
      ],
    }
    expect(access).toStrictEqual(defaultAcl)
    expect(accessFalsy).toStrictEqual(defaultAclFalsy)
  })
  it('should trigger hooks', async () => {
    await resolvers.hooks('beforeCreate', {})
    await resolvers.hooks('afterCreate', {})
    await resolvers.hooks('beforeUpdate', {})
    await resolvers.hooks('afterUpdate', {})
    await resolvers.hooks('beforeDelete', {})
    await resolvers.hooks('afterDelete', {})
    expect(hookFunc).toBeCalledTimes(6)
  })
})
