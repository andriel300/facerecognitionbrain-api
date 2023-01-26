/* eslint-disable no-shadow */
const express = require("express");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");
const { response } = require("express");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "andriel",
    password: "",
    database: "smart_brain",
  },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// hashPassword function is used to hash the password
const hashPassword = password =>
  // create a new promise
  new Promise((resolve, reject) => {
    // use bcrypt to generate a salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          // if there is an error, reject the promise
          reject(err);
        } else {
          // if there is no error, resolve the promise with the hashed password
          resolve(hash);
        }
      });
    });
  });

// registerUser function is used to register the user
const registerUser = (email, name, hash) =>
  // start a transaction using the knex library
  db.transaction(trx => {
    trx
      // Insert the email and hashed password into the 'login' table
      .insert({
        email,
        hash: hash,
      })
      .into("login")
      // Returning the email of the inserted user
      .returning("email")
      .then(loginEmail =>
        trx("users")
          // Returning all the data of the inserted user
          .returning("*")
          // Inserting the remaining data into the 'users' table
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .then(
            user =>
              // returning the inserted user
              user[0],
          ),
      )
      // Commit the transaction
      .then(trx.commit)
      // If there is an error rollback the transaction
      .catch(trx.rollback);
  });

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { email, password } = req.body;
    // Selecting the email and hash columns from the login table where the email is equal to the email provided in the request
    const loginData = await db
      .select("email", "hash")
      .from("login")
      .where("email", email);
    // Checking if there is no record for the provided email
    if (loginData.length === 0) {
      return res.status(400).json("Wrong credentials: Email not found.");
    }
    // Comparing the password provided in the request to the hash retrieved from the login table
    const isValid = await bcrypt.compare(password, loginData[0].hash);
    // If the password is invalid
    if (!isValid) {
      return res.status(400).json("Wrong credentials: Invalid password.");
    }
    // Selecting all columns from the users table where the email is equal to the email provided in the request
    const userData = await db.select("*").from("users").where("email", email);
    // Checking if there is no record for the provided email
    if (userData.length === 0) {
      return res.status(400).json("Wrong credentials: User not found.");
    }
    // If there is a record
    return res.json(userData[0]);
  } catch (err) {
    // If there is an error with the query
    return res.status(400).json(`Error: ${err}`);
  }
});

// POST request for the 'register' endpoint.
app.post("/register", async (req, res) => {
  try {
    // Extract the email, name, and password from the request body
    const { email, name, password } = req.body;
    // hash the password
    const hash = await hashPassword(password);
    // register the user
    const user = await registerUser(email, name, hash);
    // return the inserted user
    res.json(user);
  } catch (err) {
    // if there is an error, return a status code of 400 and the error message
    res.status(400).json(`Unable to register: ${err}`);
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select("*").from("users").where({ id });

    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json("Not Found");
    }
  } catch (err) {
    res.status(400).json("error getting user");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json(`unable to get entries ${err}`));
});

const port = process.env.PORT || "3000";
app.set("port", port);
const server = http.createServer(app);
server.listen(port);
server.on("listening", () => {
  console.log(`Listening on ${port}`);
});
