// import { Schema } from "mongoose"

interface TMetaModel {
  id: string,
  _id: string,
  name: string,
  prefix: string,
  managed: boolean,
  createdBy: string,
  updatedBy: string
}

interface TModelField {
  id: string,
  _id: string,
  model: string,
  name: string,
  createdBy: string,
  updatedBy: string,
  fieldName: string,
  type: string
  required: boolean,
  default: string,
  rounds: number,
  unique: boolean,
  ref: string,
  localField: string,
  foreignField: string,
  enumType: string,
  enumValues: string[],
  managed: boolean,
  fieldOptions: string[] | TFieldOption[]  // string or populated one?
}

interface TFieldOption {
  id: string,
  _id: string,
  model: string | TMetaModel,
  modelName: string,
  modelField: string | TModelField,
  fieldName: string,
  keyName: string,
  type: 'number' | 'string' | 'boolean',
  value:  string,
  managed: boolean,
  prefix:  string
}

interface TModelOption {
  id: string,
  _id: string,
  model: string, 
  name: string,
  managed: boolean,
  keyName: string,
  value: string,
  type: string,
  createdBy: string,
  updatedBy: string,
}


