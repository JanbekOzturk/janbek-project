// db.js
const { MongoClient } = require('mongodb');

let client;
let db;

/**
 * Connect once and store the db instance.
 */
async function connectToDatabase(uri, dbName) {
  if (db) {
    // already connected
    return db;
  }

  client = new MongoClient(uri);

  await client.connect();
  console.log('✅ MongoDB connected (native driver)');

  db = client.db(dbName);
  return db;
}

/**
 * Get the current db instance.
 */
function getDb() {
  if (!db) {
    throw new Error('Database has not been initialised. Call connectToDatabase first.');
  }
  return db;
}

/**
 * Convenience helper: get a collection by name.
 */
function getCollection(name) {
  return getDb().collection(name);
}

module.exports = {
  connectToDatabase,
  getDb,
  getCollection
};
