
var PouchDB = require('pouchdb');
var db = new PouchDB('epicworshipdb',{auto_compaction: true});
PouchDB.plugin(require('pouchdb-hoodie-api'));
PouchDB.plugin(require('pouchdb-gql'));
PouchDB.plugin(require('pouchdb-migrate'));

export const initializeData = async () =>{
  console.log('Initializing DB...');

  const info = await db.info();
  // console.log('DB info:',info);

  // ensure indexes
  // await db.createIndex({
  //   index: {fields: ['entityTypes']}
  // });

}

