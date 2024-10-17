const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
const config = {};

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

if (ENV === "production") {
  if (!process.env.DATABASE_URL) {throw new Error('DATABASE_URL not set')}
  
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
