const dotenv = require('dotenv').config();
const mysql = require('mysql');
const { promisify }= require('util');

const database = {
  connectionLimit: 10,
  host: process.env.DDBB_HOST,
  user: process.env.DDBB_USER,
  password: process.env.DDBB_PASSWORD,
  database: process.env.DDBB_DATABASE
}

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;