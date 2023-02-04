const { db, bcrypt } = require("./db");

const signIn = async (req, res) => {
  try {
    // Extracting email and password from the request body
    const { email, password } = req.body;
    // User Invalid Input
    if (!email || !password) {
      return res.status(400).json("Missing required fields");
    }
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
};

module.exports = {
  handleSignin: signIn,
};
