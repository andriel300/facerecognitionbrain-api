const { db, bcrypt } = require("./db");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    // User Invalid Input
    if (!email || !name || !password) {
      return res.status(400).json("Missing required fields");
    }
    const hash = await bcrypt.hash(password, 10);
    // Inserting email and hash into the login table
    const loginData = await db.transaction(async trx => {
      const loginEmail = await trx
        .insert({
          email,
          hash,
        })
        .into("login")
        .returning("email");
      // Inserting email, name, and joined timestamp into the users table
      const user = await trx("users").returning("*").insert({
        email: loginEmail[0].email,
        name,
        joined: new Date(),
      });
      return user[0];
    });

    res.json(loginData);
  } catch (err) {
    res.status(400).json(`Unable to register: ${err}`);
  }
};

module.exports = {
  handleRegister: register,
};
