const knex = require("knex");
const bcrypt = require("bcrypt");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "andriel",
    password: "5899",
    database: "smart_brain",
  },
});

module.exports = { db, bcrypt };
