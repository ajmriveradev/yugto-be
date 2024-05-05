const { Pool } = require('pg');

const config = {
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'yugto_dev',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}


const pool = new Pool(config);

module.exports = {
  pool
}