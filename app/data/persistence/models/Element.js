import { entityTypes } from "../../../utils/data";

export const ElementSchema = {
  title: "Element Schema",
  version: 0, //https://rxdb.info/data-migration.html
  description: "An element is the building block of a Production",
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string",
      index: true
    },
    text: {
      type: "string"
    },
    details: {
      type: "object"
    },
    timestamp: {
      type: "number",
      index: true
    },
    createdTime: {
      type: "number",
    },
    entityType:{
      type: 'string',
      final: true,
      default: entityTypes.ELEMENT
    },
    elementType:{
      type: 'string',
      final: true
    },
  },
}