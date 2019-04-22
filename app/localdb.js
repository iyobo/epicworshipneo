import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";


const LOGGING = false;
const fs = require("fs");
const path = require("path");
const os = require("os");
export const storageFolder = path.join(os.homedir(), 'epicworshipData');

if (!fs.existsSync(storageFolder)) {

  console.log(`Creating ${storageFolder}...`);
  fs.mkdirSync(storageFolder);
}


// const dbPath = path.join('database', 'epicworshipdb');

PouchDB.plugin(PouchFind);


// export const db = new PouchDB(path.join(process.cwd(), "database", "epicworshipdb"), { auto_compaction: true });
export const db = new PouchDB(path.join(storageFolder, 'db'), { auto_compaction: true });

export const initializeData = async (opts) => {
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

export const upsert = async (entity: Object) => {
  let existing = await findOne({ _id: entity._id });//Do we need to know this???

  if (existing) {
    entity._rev = existing._rev;
    if (LOGGING) console.log("PouchDB updating _rev", existing._rev, entity);
  } else {
    if (LOGGING) console.log("PouchDB create", entity);
  }

  let doc = await db.put(entity, { force: true });
  return doc;
};

export const setConfig = async (name, value) => {
  return await upsert({ _id: name, value });
};

export const getConfig = async (name) => {
  return await findById(name);
};

/**
 *
 * @param id
 * @returns {Promise<void>}
 */
export const findById = async (id: String) => {
  const res = await findOne({ _id: id });
  return res;
};

/**
 *
 * @param where
 * @param sort - array of fields to sort by
 * @returns {Promise<*>}
 */
export const find = async (where: Object, sort: Array) => {
  const { docs } = await db.find({
    selector: where
    // sort: sort //TODO: figure this out
  });
  if (LOGGING) console.log("PouchDB find", where, docs);
  return docs;
};

/**
 *
 * @param where
 * @param sort
 * @returns {Promise<null>}
 */
export const findOne = async (where: Object, sort: Array) => {
  const list = await find(where, sort);
  return list.length > 0 ? list[0] : null;
};

/**
 *
 * @param entityId
 * @returns {Promise<void>}
 */
export const remove = async (entityId) => {
  const doc = await findById(entityId);
  if (LOGGING) console.log("PouchDB remove", doc);
  if (doc)
    return await db.remove(doc);

};

