import RxDB from "rxdb";
import { ProductionSchema } from "./models/Production";
import { ElementSchema } from "./models/Element";
import { SettingSchema } from "./models/Setting";

RxDB.plugin(require("pouchdb-adapter-leveldb"));

const fs = require("fs");
const path = require("path");
const databaseFolderPath = path.join(__dirname, "..", "..", "..", "database");


/**
 * Handles all persistence operations.
 */
export let db = null;
export let initialized = false;

export const initializeData = async (app) => {

  console.log("Initializing DB...");

  if (!fs.existsSync(databaseFolderPath)) {

    console.log(`Creating ${databaseFolderPath}...`);
    fs.mkdirSync(databaseFolderPath);
  }

  db = await RxDB.create({
    name: "epicdb",           // <- name
    adapter: "leveldb",          // <- storage-adapter
    // password: 'epicPass',     // <- password (optional)
    multiInstance: true,         // <- multiInstance (optional, default: true)
    queryChangeDetection: false // <- queryChangeDetection (optional, default: false)
  });

  //load models. For more options, see https://rxdb.info/rx-collection.html
  await db.collection({
    name: "productions",
    schema: ProductionSchema,
    autoMigrate: true
  });

  await db.collection({
    name: "elements",
    schema: ElementSchema,
    autoMigrate: true
  });

  await db.collection({
    name: "settings",
    schema: SettingSchema,
    autoMigrate: true
  });

  initialized = true;

  console.log("Database Initialized");
};

export const setConfig = async (id, value) => {
  return await db.settings.atomicUpsert({ id, value, timestamp: Date.now() });
};