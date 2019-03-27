//NOTE: leveldb is dumb and sometimes LOCKS things. We need to ensure that each time we start the app, we force a delete of any LOCK files in the database folder
const fs = require('fs');
const path = require('path');

const databaseFolderPath = path.join(__dirname,'..', 'database');
if (!fs.existsSync(databaseFolderPath)){

  console.log(`Creating ${databaseFolderPath}...`)
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

const props= process.env;

export const db = new PouchDB(path.join(__dirname,'..', 'database','epicworshipdb'), { auto_compaction: true});
export const api = db.hoodieApi();

export const initializeData = async () => {
  console.log("Initializing DB...");

  const info = await db.info();
  // console.log('DB info:',info);

  // ensure indexes
  await db.createIndex({
    index: { name:'entityListIdx',fields: ["elementType","dateCreated"] }
  });

  await db.createIndex({
    index: { name:'entitySearchIdx', fields: ["elementType","dateCreated", "name"] }
  });
};

// export const productionDB = api.withIdPrefix('production/');
// export const elementDB = api.withIdPrefix('element/');
// export const configDB = api.withIdPrefix('config/');

export const epicDB = { db, api };