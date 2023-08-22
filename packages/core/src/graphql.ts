import { mapKeys, startCase } from 'lodash';

export class Mgraphql {
  fieldTypeMap: { [key: string]: string } = {
    string: 'String',
    number: 'Int',
    boolean: 'Boolean',
    enum: 'enum',
  };
  public genQuery(name: string, fields: TFields) {
    const querySchema: string[] = [];
    const additionalTypes: string[] = [];
    querySchema.push(`type ${name} {`);
    mapKeys(fields, (value, key) => {
      let fieldType: string =
        value.type == 'enum' && value.enumType
          ? `${name}${startCase(key)}EnumType`
          : value.type === 'relationship' && value.ref
          ? value.ref
          : this.fieldTypeMap[value.type];
      if (value.isRequired) {
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
    querySchema.push('}');
    return querySchema.join('\n') + additionalTypes.join('\n');
  }

  public genInput(name: string, fields: TFields) {
    const querySchema: string[] = [];
    querySchema.push(`input ${name}Input {`);
    mapKeys(fields, (value, key) => {
      let fieldType: string =
        value.type == 'enum' && value.enumType
          ? `${name}${startCase(key)}EnumType`
          : value.type === 'relationship' && value.ref
          ? 'String'
          : this.fieldTypeMap[value.type];
      if (value.isRequired) {
        fieldType += '!';
      }
      if (value.many) {
        fieldType = `[${fieldType}]`;
      }
      querySchema.push(`    ${key}: ${fieldType}`);
    });
    querySchema.push('}');
    return querySchema.join('\n');
  }

  public genWhereInput(name: string, fields: TFields) {
    const querySchema: string[] = [];
    querySchema.push(`input where${name}Input {`);
    mapKeys(fields, (value, key) => {
      querySchema.push(this.generateWhereInput(name, key, value.type));
    });
    querySchema.push('}');
    return querySchema.join('\n');
  }

  public genModel(name: string, fields: TFields, options: TOptions) {
    const query = this.genQuery(name, fields);
    const input = this.genInput(name, fields);
    const whwreInput = this.genWhereInput(name, fields);
    return `
type Query {
    get${name}(id: ID!): ${name}
    list${name}(limit: Int, offset: Int, where: where${name}Input): [${name}]
}

type Mutation {
    create${name}(input: ${name}Input!): ${name}
    update${name}(id: ID!, input: ${name}Input!): ${name}
    delete${name}(id: ID!): ${name}
}

${query}\n\n${input}\n\n${whwreInput}
    `;
  }

  generateWhereInput(name: string, Field: string, type: string) {
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
}
