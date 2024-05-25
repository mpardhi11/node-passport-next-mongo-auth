import mongoose from 'mongoose';
import { config } from './index.js';
export const connectToDb = async () => {
  try {
    const dbOptions = { dbName: config.dbName };

    mongoose.connection.on('connected', () => {
      console.log('Connected to the database');
    });

    mongoose.connection.on('error', (error) => {
      console.error('Error connecting to the database: ', error);
    });

    await mongoose.connect(config.dbConnectionString, dbOptions);
  } catch (error) {
    console.error('Error connecting to the database: ', error);
    // Exit the process if the connection fails with an error
    process.exit(1);
  }
};
