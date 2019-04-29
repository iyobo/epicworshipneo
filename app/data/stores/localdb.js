/**
 * A data storage utility that can be used with electron.remote.
 *
 * entityType defines the group of a data item.
 * elementType can be used as a subgroup within an entity. Useful for further categorization within different types of entities.
 * timestamp will always be the last time an item was upserted (created or updated).
 *
 * These covers most use cases for file data storage.
 */
const electron = require("electron").remote;

const PouchDB = require("pouchdb");
const PouchFind = require("pouchdb-find");

const fs = require("fs");
const path = require("path");
const os = require("os");

let LOGGING = true;
let initialized = false;

PouchDB.plugin(PouchFind);

const _checkInit = () => {
  if (!initialized)
    throw new Error('FilePouch not initialized. Please run initializeData(...)');
}

let db = null;


const initializeData = exports.initializeData = async (opts) => {
  console.log("Initializing DB...");

  const {
    storageFolder,
    verbose,
    databaseFileName = 'db',
    pouchOpts = {auto_compaction: true},
    indexes
  } = opts;

  if (verbose) LOGGING = true;

  if (!storageFolder) throw new Error('opts.storageFolder is required by filepouch')

  //Create storage folder if full directory path does not exist
  if (!fs.existsSync(storageFolder)) {
    console.log(` Attempting to create ${storageFolder}...`);
    fs.mkdirSync(storageFolder);
  }


  db = new PouchDB(path.join(storageFolder, databaseFileName), pouchOpts);


  // ensure  inbuilt indexes
  await db.createIndex({
    index: {fields: ["entityType", "timestamp"]}
  });

  await db.createIndex({
    index: {fields: ["elementType", "timestamp"]}
  });

  await db.createIndex({
    index: {fields: ["entityType", "elementType", "timestamp"]}
  });

  //ensure custom indexes
  if (indexes) {
    if (!Array.isArray(indexes)) throw new Error('filepuch: initializeData: opts.indexes must be an array of pouchdb index field arrays')

    indexes.forEach(async (it) => {
      await db.createIndex({
        index: {fields: it}
      });
    })
  }

  initialized = true;
};

const upsert = exports.upsert = async (entity) => {
  _checkInit();

  let existing = await findOne({_id: entity._id});//Do we need to know this???

  if (existing) {
    entity._rev = existing._rev;
    if (LOGGING) console.log("PouchDB updating _rev", existing._rev, entity);
  } else {
    if (LOGGING) console.log("PouchDB create", entity);
  }

  entity.timestamp = Date.now();

  console.log(entity);

  let doc = await db.put(entity, {force: true});
  return doc;
};

const setConfig = exports.setConfig = async (name, value) => {
  _checkInit();
  return await upsert({_id: name, value});
};

const getConfig = exports.getConfig = async (name) => {
  _checkInit();
  return await findById(name);
};

/**
 *
 * @param id
 * @returns {Promise<void>}
 */
const findById = exports.findById = async (id) => {
  _checkInit();
  const res = await findOne({_id: id});
  return res;
};

/**
 *
 * @param where
 * @param sort - <Array> array of fields to sort by
 * @returns {Promise<*>}
 */
const find = exports.find = async (where, sort) => {
  _checkInit();
  const {docs} = await db.find({
    selector: where
    // sort: sort //TODO: figure this out
  });
  if (LOGGING) console.log("PouchDB find", where, docs);
  return docs;
};

/**
 *
 * @param where <Object>
 * @param sort <Array>
 * @returns {Promise<null>}
 */
const findOne = exports.findOne = async (where, sort) => {
  _checkInit();
  const list = await find(where, sort);
  return list.length > 0 ? list[0] : null;
};

/**
 *
 * @param entityId
 * @returns {Promise<void>}
 */
const remove = exports.remove = async (entityId) => {
  _checkInit();
  const doc = await findById(entityId);
  if (LOGGING) console.log("PouchDB remove", doc);
  if (doc)
    return await db.remove(doc);

};

