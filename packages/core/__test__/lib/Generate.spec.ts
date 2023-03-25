import Generate from '../../src/Generate'
import {
  TodoSchema,
  TodoGql,
  UserSchema,
  UserGql,
  baseTypedefs,
} from '../sampleModel.mock'

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

describe('shoudl validate generate', () => {
  let generate: any
  beforeAll(() => {
    generate = new Generate(
      {
        _model: 'User',
        ...UserSchema,
        access: {
          default: false,
          acl: [{ ADMIN: () => ({ read: () => false }) }],
        },
        public: false,
      },
      {
        schemaList: [],
        adminRole: 'ADMIN',
        roles: ['ADMIN', 'USER', 'ANONYMOUS'],
        adapter: 'mongoose',
        path: './',
      }
    )
  })
  it('should get type for gql', () => {
    const getString = generate.getFieldType('string')
    const getMongoInt = generate.getFieldType('number', 'mongo')

    expect(getString).toBe('String')
    expect(getMongoInt).toBe('Number')
  })

  it('should generate gql schema', () => {
    const { schema } = generate.grpahqlSchema()
    expect(schema).toBe(UserGql)
  })

  it('should generate resolvers', () => {
    const queries = ['allTodos', 'getTodo']
    const mutations = [
      'createTodo',
      'updateTodo',
      'deleteTodo',
      'createTodos',
      'updateTodos',
      'deleteTodos',
    ]
    const resolvers = generate.graphqlResolver(queries, mutations)

    expect(typeof resolvers.Query.allTodos).toBe('function')
    expect(typeof resolvers.Query.getTodo).toBe('function')
    expect(typeof resolvers.Mutation.createTodo).toBe('function')
  })

  it('should generate Mongo Model', async () => {
    const { newSchema, newModel } = generate.mongoModel()
    expect(newSchema).toBeDefined()
    expect(newModel).toBeDefined()
  })

  it('should generate where input ID', () => {
    const genWhereInput = generate.generateWhereInput('id', 'ID')
    expect(genWhereInput).toBe(`  id: whereID`)
  })
  it('should generate where input string', () => {
    const genWhereInput = generate.generateWhereInput('name', 'String')
    expect(genWhereInput).toBe(`  name: whereString`)
  })
  it('should generate where input Int', () => {
    const genWhereInput = generate.generateWhereInput('orgUsers', 'Int')
    expect(genWhereInput).toBe(`  orgUsers: whereInt`)
  })
  it('should generate graphql field type', () => {
    const graphqlString = generate.getGraphqlField(
      { type: 'string', many: false },
      'role'
    )
    const graphqlNumber = generate.getGraphqlField(
      { type: 'number', many: true },
      'role'
    )
    const graphqlFloat = generate.getGraphqlField({ type: 'float' }, 'role')
    const graphqlBoolean = generate.getGraphqlField({ type: 'boolean' }, 'role')
    const graphqlEnum = generate.getGraphqlField(
      {
        type: 'enum',
        enum: ['Roshan', 'Vamshi'],
      },
      'role'
    )
    const graphqlPassword = generate.getGraphqlField(
      { type: 'password' },
      'password'
    )

    // Expect the field types
    expect(graphqlString).toBe('String')
    expect(graphqlNumber).toBe('[Int]')
    expect(graphqlFloat).toBe('Float')
    expect(graphqlBoolean).toBe('Boolean')
    expect(graphqlEnum).toBe('UserRoleEnumType')
    expect(graphqlPassword).toBeUndefined()
  })
})
