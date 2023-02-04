const express = require("express");
// This line imports the Express.js framework, which allows for easy routing and handling of HTTP requests and responses.
const http = require("http");
// This line imports the built-in Node.js HTTP module, which provides an HTTP server and client functionality.
const cors = require("cors");
// This line imports the cors middleware, this package allows to enable CORS with various options.
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const predict = require("./controllers/predict");
// These lines import the different route handlers for handling user registration, login, profile retrieval, and image upload.
const { db, bcrypt } = require("./controllers/db");
// This line imports the database and bcrypt configuration.
const app = express();
// This line creates an Express.js application instance.

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// These lines add middleware to the Express.js application to handle URL encoded data, JSON data, and CORS.

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/predict", (req, res) => {
  predict.handleApiCall(req, res);
});

const port = process.env.PORT || "3000";
app.set("port", port);
const server = http.createServer(app);
server.listen(port);
server.on("listening", () => {
  console.log(`Listening on ${port}`);
});
