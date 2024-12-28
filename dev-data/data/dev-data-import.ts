import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../../models/tourModel';

dotenv.config({ path: './config.env' });

const URL: string = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(URL).then(() => console.log('connected to DB successfully'));
// Import tour data
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Data Insertion to your db

const importData = async () => {
  try {
    console.log('Importing all your docs...');
    await Tour.create(data);
    console.log('Data Loaded Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    console.log('Deleting all your docs...');
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const scriptType = process?.argv[2]?.replace('--', '');
const options = {
  import: importData,
  delete: deleteData,
};

if (options[scriptType]) options[scriptType]();
