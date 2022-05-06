const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const consola = require('console');

exports.connectDB = async () =>
  await mongoose.connect(process.env.LOCAL_DB_URI);
