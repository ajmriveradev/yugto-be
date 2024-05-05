const db = require("../services/database");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * from users");

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}