declare class Resolvers {
  _roles: Array<string>
  generate: Generate
  modelName: string
  modelFields: FieldsMap
}

type PopulateType = Array<{
  path: string
  select: string
  populate?: Array<{ path: string; select?: string }>
  options?: any
}>

interface FinalAclMatrix {
  default: boolean
  acl: [
    {
      [key: string]: {
        read: boolean
        create: boolean
        update: boolean
        delete: boolean
      }
    }
  ]
}
