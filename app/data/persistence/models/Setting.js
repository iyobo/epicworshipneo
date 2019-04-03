import { entityTypes } from "../../../utils/data";

export const SettingSchema = {
  title: "Setting Schema",
  version: 0, //https://rxdb.info/data-migration.html
  description: "A Setting represents a changeable configuration value within the application",
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    value: {
      type: "any"
    },
    timestamp: {
      type: "number"
    },
    entityType:{
      type: 'string',
      final: true,
      default: entityTypes.SETTING
    }
  },
}

export const configs={
  liveProductionId: 'liveProductionId'
}