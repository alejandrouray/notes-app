const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;
const isTestEnv = NODE_ENV === 'test';

const connectionString = isTestEnv
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI;

async function connectDb () {
  try {
    await mongoose.connect(connectionString);
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
}

connectDb();

process.on('uncaughtException', () => {
  mongoose.connection.close();
});
