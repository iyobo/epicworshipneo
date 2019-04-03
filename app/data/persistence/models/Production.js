import { entityTypes } from "../../../utils/data";

export const ProductionSchema = {
  title: "Production Schema",
  version: 0, //https://rxdb.info/data-migration.html
  description: "A Production is a set of elements",
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
    timestamp: {
      type: "number",
      index: true
    },
    createdTime: {
      type: "number",
    },
    entityType: {
      type: "string",
      final: true,
      default: entityTypes.PRODUCTION
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            "type": "string"
          },
          elementType: {
            "type": "string"
          },
          elementId: {
            "type": "string"
          }
        }
      }
    }
  }
};