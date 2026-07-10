const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000); // 30 seconds for MongoDB Memory Server download/setup

let mongoServer;

module.exports.setupDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

module.exports.teardownDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports.clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
