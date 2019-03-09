//NOTE: leveldb is dumb and sometimes LOCKS things. We need to ensure that each time we start the app, we force a delete of any LOCK files in the database folder
const fs = require('fs');
const path = require('path');
try {
  fs.unlinkSync('../../epicworshipdb/LOCK');
}catch(err){
  // console.warn(err)
}

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

// export const db = new PouchDB("epicworshipdb", { auto_compaction: true, adapter: 'websql' });
export const db = new PouchDB(path.join(__dirname,'..','..', 'epicworshipdb'), { auto_compaction: true});
export const api = db.hoodieApi();

export const initializeData = async () => {
  console.log("Initializing DB...");

  const info = await db.info();
  // console.log('DB info:',info);

  // ensure indexes
  await db.createIndex({
    index: { fields: ["entityType"] }
  });

};

// export const productionDB = api.withIdPrefix('production/');
// export const elementDB = api.withIdPrefix('element/');
// export const configDB = api.withIdPrefix('config/');

export const epicDB = { db, api };