import { mapKeys, startCase } from 'lodash';
import { Model } from './models';
import { allowedSortFieldTypes, whereInputCompose } from './utility';

export const fieldTypeMap: { [key: string]: string } = {
  string: 'String',
  number: 'Int',
  boolean: 'Boolean',
  enum: 'enum',
  relationship: 'relationship',
};
export class Mgraphql {
  // Generate graphql typedefs
  public static genQuery(name: string, fields: TFields) {
    const querySchema: string[] = [];
    const additionalTypes: string[] = [];
    querySchema.push(`type ${name} {`);
    mapKeys(fields, (value, key) => {
      if (
        ('bcrypt' in value && value.bcrypt) ||
        ('ignoreGraphQL' in value && value.ignoreGraphQL)
      ) {
        return;
      }
      let fieldType: string =
        value.type == 'enum' && value.enumType
          ? `${name}${startCase(key)}EnumType`
          : value.type === 'relationship' && value.ref
          ? value.ref
          : fieldTypeMap[value.type];
      if (value.required) {
        fieldType += '!';
      }
      if (value.many) {
        fieldType = `[${fieldType}]`;
      }

      if (value.enum) {
        additionalTypes.push(``);
        additionalTypes.push(``);
        additionalTypes.push(`enum ${name}${startCase(key)}EnumType {`);
        value.enum.forEach((enumValue) => {
          additionalTypes.push(`    ${enumValue}`);
        });
        additionalTypes.push(`}`);
      }
      querySchema.push(`    ${key}: ${fieldType}`);
    });
    querySchema.push('    createdOn: DateTime');
    querySchema.push('    updatedOn: DateTime');
    querySchema.push('}');
    return querySchema.join('\n') + additionalTypes.join('\n');
  }

  public static genInput(name: string, fields: TFields) {
    const inputSchema: string[] = [];
    inputSchema.push(`input ${name}Input {`);
    mapKeys(fields, (value, key) => {
      if ('ignoreGraphQL' in value && value.ignoreGraphQL) {
        return;
      }
      let fieldType: string =
        value.type == 'enum' && value.enumType
          ? `${name}${startCase(key)}EnumType`
          : value.type === 'relationship' && value.ref
          ? 'String'
          : fieldTypeMap[value.type];
      if (value.required) {
        fieldType += '!';
      }
      if (value.many) {
        fieldType = `[${fieldType}]`;
      }
      inputSchema.push(`    ${key}: ${fieldType}`);
    });
    inputSchema.push('}');
    return inputSchema.join('\n');
  }

  public static genUpdateInput(name: string, fields: TFields) {
    const inputSchema: string[] = [];
    inputSchema.push(`input update${name}Input {`);
    inputSchema.push(`    id: String`);
    mapKeys(fields, (value, key) => {
      if ('ignoreGraphQL' in value && value.ignoreGraphQL) {
        return;
      }
      let fieldType: string =
        value.type == 'enum' && value.enumType
          ? `${name}${startCase(key)}EnumType`
          : value.type === 'relationship' && value.ref
          ? 'String'
          : fieldTypeMap[value.type];
      if (value.required) {
        fieldType += '!';
      }
      if (value.many) {
        fieldType = `[${fieldType}]`;
      }
      inputSchema.push(`    ${key}: ${fieldType}`);
    });
    inputSchema.push('}');
    return inputSchema.join('\n');
  }

  public static genWhereInput(name: string, fields: TFields) {
    const whereInputSchema: string[] = [];
    whereInputSchema.push(`input where${name}Input {`);
    mapKeys(fields, (value, key) => {
      if (
        ('bcrypt' in value && value.bcrypt) ||
        ('ignoreGraphQL' in value && value.ignoreGraphQL)
      ) {
        return;
      }
      whereInputSchema.push(this.generateWhereInput(name, key, value.type));
    });
    whereInputSchema.push('    createdOn: whereDateTime');
    whereInputSchema.push('    updatedOn: whereDateTime');
    whereInputSchema.push(`    AND: [where${name}Input!]`);
    whereInputSchema.push(`    OR: [where${name}Input!]`);
    whereInputSchema.push('}');
    return whereInputSchema.join('\n');
  }

  public static genSortInput(name: string, fields: TFields) {
    const sortSchema: string[] = [];
    sortSchema.push(`input sort${name}Input {`);
    mapKeys(fields, (value, key) => {
      if (
        ('bcrypt' in value && value.bcrypt) ||
        ('ignoreGraphQL' in value && value.ignoreGraphQL)
      ) {
        return;
      }
      if (allowedSortFieldTypes.includes(value.type)) {
        sortSchema.push(`    ${key}: sort`);
      }
    });
    sortSchema.push(`    createdOn: sort`);
    sortSchema.push(`    updatedOn: sort`);
    sortSchema.push('}');
    return sortSchema.join('\n');
  }

  public static genModel(name: string, fields: TFields, options?: TOptions) {
    const query = this.genQuery(name, fields);
    const input = this.genInput(name, fields);
    const updateInput = this.genUpdateInput(name, fields);
    const whereInput = this.genWhereInput(name, fields);
    const sortInput = this.genSortInput(name, fields);
    return `
type Query {
    get${name}(where: where${name}Input!): ${name}
    list${name}s(where: where${name}Input, sort: sort${name}Input = {},offset: Int! = 0, limit: Int! = 10): [${name}]
}

type Mutation {
    create${name}(input: ${name}Input!): ${name}
    create${name}s(input: [${name}Input!]!): [${name}]
    update${name}(input: update${name}Input!): ${name}
    update${name}s(input: [update${name}Input!]!): [${name}]
    delete${name}(id: ID!): ${name}
    delete${name}s(ids: [ID!]): ${name}
}

${query}\n\n${input}\n\n${updateInput}\n\n${whereInput}\n\n${sortInput}
    `;
  }

  public static generateWhereInput(name: string, Field: string, type: string) {
    switch (type) {
      case 'ID':
      case 'relationship':
        return `    ${Field}: whereID`;
        break;

      case 'string':
        return `    ${Field}: whereString`;
        break;

      case 'number':
        return `    ${Field}: whereInt`;
        break;

      case 'date':
        return `    ${Field}: whereDateTime`;
        break;

      case 'boolean':
        return `    ${Field}: Boolean`;
        break;

      case 'enum':
        return `    ${Field}: ${name}${startCase(Field)}EnumType`;
        break;

      default:
        return ``;
        break;
    }
  }
  // Generate graphql resolvers
  public static genResolvers(name: string, model: Model) {
    return {
      Query: {
        // get the record by where clause
        [`get${name}`]: async (root: any, args: { where: any }, ctx: any) => {
          const whereInput = whereInputCompose(args.where, model.model.fields);
          return await model.get(whereInput, ctx.user, {
            root,
            args,
            ctx,
            internal: false,
          });
        },
        // list records by where clause
        [`list${name}s`]: async (
          root: any,
          args: { where: object; sort: object; offset: number; limit: number },
          ctx: any
        ) => {
          const whereInput = whereInputCompose(args.where, model.model.fields);

          return await model.paginate(
            whereInput,
            { sort: args.sort, offset: args.offset, limit: args.limit },
            ctx.user,
            {
              root,
              args,
              ctx,
              internal: false,
            }
          );
        },
      },
      Mutation: {
        // create a new record resolver
        [`create${name}`]: async (
          root: any,
          args: { input: any },
          ctx: any
        ) => {
          return await model.create(args.input, ctx.user, {
            root,
            args,
            ctx,
            internal: false,
          });
        },
        // create multiple record resolver
        [`create${name}s`]: async (
          root: any,
          args: { input: any[] },
          ctx: any
        ) => {
          return await Promise.all(
            args.input.map(
              async (item) =>
                await model.create(item, ctx.user, {
                  root,
                  args: item,
                  ctx,
                  internal: false,
                })
            )
          );
        },
        // update a record, resolver
        [`update${name}`]: async (
          root: any,
          args: { id: string; input: any },
          ctx: any
        ) => {
          return await model.update(args.id, args.input, ctx.user, {
            root,
            args,
            ctx,
            internal: false,
          });
        },
        // update mutilple records, resolver
        [`update${name}s`]: async (
          root: any,
          args: { input: any },
          ctx: any
        ) => {
          return await Promise.all(
            args.input.map(
              async (item: any) =>
                await model.update(item.id, item, ctx.user, {
                  root,
                  args,
                  ctx,
                  internal: false,
                })
            )
          );
        },
        // delete record resolver
        [`delete${name}`]: async (
          root: any,
          args: { id: string },
          ctx: any
        ) => {
          return await model.delete(args.id, ctx.user, {
            root,
            args,
            ctx,
            internal: false,
          });
        },
        // delete multiple records resolver
        [`delete${name}s`]: async (
          root: any,
          args: { ids: [string] },
          ctx: any
        ) => {
          return await Promise.all(
            args.ids.map(
              async (item) =>
                await model.delete(item, ctx.user, {
                  root,
                  args: item,
                  ctx,
                  internal: false,
                })
            )
          );
        },
      },
    };
  }
}
