import RxDB from "rxdb";





const fs = require("fs");
const path = require("path");

const databaseFolderPath = path.join(__dirname, "..", "database");
if (!fs.existsSync(databaseFolderPath)) {

  console.log(`Creating ${databaseFolderPath}...`);
  fs.mkdirSync(databaseFolderPath);
}


// const dbPath = path.join('database', 'epicworshipdb');

import PouchDB from "pouchdb";
import PouchHoodieApi from "pouchdb-hoodie-api";
import PouchGQL from "pouchdb-gql";
import PouchMigrate from "pouchdb-migrate";
import PouchFind from "pouchdb-find";

PouchDB.plugin(PouchHoodieApi);
PouchDB.plugin(PouchGQL);
PouchDB.plugin(PouchMigrate);
PouchDB.plugin(PouchFind);
// PouchDB.plugin(require('pouchdb-adapter-node-websql'));

const props = process.env;

export const db = new PouchDB(path.join(__dirname, "..", "database", "epicworshipdb"), { auto_compaction: true });
export const api = db.hoodieApi();

let rxdb = null;

export const initializeData = async () => {
  console.log("Initializing DB...");

  const info = await db.info();
  // console.log('DB info:',info);

  // ensure indexes
  await db.createIndex({
    index: { name: "entityListIdx", fields: ["elementType", "dateCreated"] }
  });

  await db.createIndex({
    index: { name: "entitySearchIdx", fields: ["elementType", "dateCreated", "name"] }
  });


  rxdb = await RxDB.create({
    name: 'epicdb',           // <- name
    adapter: 'leveldb',          // <- storage-adapter
    password: 'epicPass',     // <- password (optional)
    multiInstance: true,         // <- multiInstance (optional, default: true)
    queryChangeDetection: false // <- queryChangeDetection (optional, default: false)
  });
  console.dir(rxdb);
};

// export const productionDB = api.withIdPrefix('production/');
// export const elementDB = api.withIdPrefix('element/');
// export const configDB = api.withIdPrefix('config/');

export const epicDB = { db, api , rxdb};

export const saveProduction = async (production) => {

};