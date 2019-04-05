import PouchDB from "pouchdb";
import PouchHoodieApi from "pouchdb-hoodie-api";
import PouchGQL from "pouchdb-gql";
import PouchMigrate from "pouchdb-migrate";
import PouchFind from "pouchdb-find";
import upsertBulk from "pouchdb-upsert-bulk";

const fs = require("fs");
const path = require("path");

const databaseFolderPath = path.join(__dirname, "..", "database");
if (!fs.existsSync(databaseFolderPath)) {

  console.log(`Creating ${databaseFolderPath}...`);
  fs.mkdirSync(databaseFolderPath);
}

// const dbPath = path.join('database', 'epicworshipdb');

PouchDB.plugin(PouchHoodieApi);
PouchDB.plugin(PouchGQL);
PouchDB.plugin(PouchMigrate);
PouchDB.plugin(PouchFind);
PouchDB.plugin(upsertBulk);

export const db = new PouchDB(path.join(__dirname, "..", "database", "epicworshipdb"), { auto_compaction: true });
export const api = db.hoodieApi();

export const initializeData = async () => {
  console.log("Initializing DB...");

  const info = await db.info();
  // console.log('DB info:',info);

  // ensure indexes
  await db.createIndex({
    index: { fields: ["entityType", "timestamp"] }
  });

  await db.createIndex({
    index: { fields: ["elementType", "timestamp"] }
  });

  await db.createIndex({
    index: { fields: ["entityType", "elementType", "timestamp"] }
  });

  //Figure out something for full-text search for name+text
  // await db.createIndex({
  //   index: { fields: ["entityType", "elementType", "timestamp", "name"] }
  // });
};


export const epicDB = { db, api };

export const upsert = async (entity: Object) => {
  let existing = await db.get(entity._id);//Do we need to know this???

  if(existing && existing._rev !== entity._rev){
    entity._rev = existing._rev;
  }

  let doc = await db.put(entity);

  return doc;
};

export const setConfig = async (name, value)=>{
  return await upsert({_id:name, value});
}

/**
 *
 * @param id
 * @returns {Promise<void>}
 */
export const findById = async (id: String) => {
  return await findOne({_id:id});
};

/**
 *
 * @param where
 * @param sort - array of fields to sort by
 * @returns {Promise<*>}
 */
export const find = async (where: Object, sort: Array) => {
  const {docs} = await db.find({
    selector: where,
    // sort: sort //TODO: figure this out
  });
  return docs;
};

/**
 *
 * @param where
 * @param sort
 * @returns {Promise<null>}
 */
export const findOne = async (where: Object, sort: Array) => {
  const list = find(where, sort);
  return list.length > 0 ? list[0] : null;
};

/**
 *
 * @param entityId
 * @returns {Promise<void>}
 */
export const remove = async (entityId) => {
  const doc = await findById(entityId);
  if(doc)
    return await db.remove(doc);

};

