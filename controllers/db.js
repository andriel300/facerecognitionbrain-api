const knex = require("knex");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

module.exports = { db, bcrypt };
