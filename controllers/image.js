const { db } = require("./db");

const handleImage = async (req, res) => {
  try {
    const { id } = req.body;
    const entries = await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");

    return res.json(entries[0].entries);
  } catch (error) {
    return res.status(400).json(`Unable to get entries: ${error.message}`);
  }
};

module.exports = {
  handleImage,
};
