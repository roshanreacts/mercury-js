declare class Mercury {
  schemaList: Array<schemaType>
  roles: Array<string>
  adminRole: string
  adapter: DbAdapter
  path: string
  db: { [x: string]: any }
  createList: (name: string, schema: listSchema) => void
}

type DbAdapter = 'mongoose'

declare interface String {
  toProperCase: () => string
}
declare const mercury: Mercury
declare interface ComponentType {
  component: string
  props?: { [x: string]: any } | null
  children:
    | Array<ComponentType>
    | ComponentType
    | null
    | string
    | number
    | boolean
}
declare interface ViewType {
  path: string
  component: ComponentType
  data?: {
    [x: string]: any
  }
  methods?: {
    [x: string]: () => void | any
  }
  templates?: {
    [x: string]: any
  }
  compoLib: {
    [x: string]: any
  }
}
declare interface ViewTypeArray {
  path: string
  component: Array<ComponentType> | ComponentType
  data?: {
    [x: string]: any
  }
  methods?: {
    [x: string]: () => void | any
  }
  templates?: {
    [x: string]: any
  }
  compoLib: {
    [x: string]: any
  }
}
