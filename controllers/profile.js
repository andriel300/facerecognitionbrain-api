const { db } = require("./db");

const profile = async (req, res) => {
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
};

module.exports = {
  handleProfileGet: profile,
};
