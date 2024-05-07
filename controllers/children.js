const db = require("../services/database");

exports.getAllChildren = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * from children");
    console.log("RESULT: ", result);
    return res.status(200).json(result?.rows);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.createChild = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, religion, parentId } = req.body;

    if (!parentId) {
      return res.status(422).json({ error: "Parent ID is required!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from users where id=$1)',
      values: [parentId]
    });

    const parentExists = checkIfExists?.rows[0].exists;

    if (!parentExists) {
      return res.status(400).json({ message: "Parent does not exist!" });
    }

    const query = {
      text: 'INSERT INTO children(first_name, last_name, birth_date, religion, parent_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [firstName, lastName, birthDate, religion, parentId]
    }

    const result = await db.pool.query(query);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.updateChild = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, religion } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "ID is required!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from children where id=$1)',
      values: [id]
    });

    const idExists = checkIfExists?.rows[0].exists;

    if (!idExists) {
      return res.status(400).json({ message: "Child does not exist!" });
    }

    const query = {
      text: 'UPDATE children SET first_name=$1, last_name=$2, birth_date=$3, religion=$4 where id=$5 RETURNING *',
      values: [firstName, lastName, birthDate, religion, id]
    }

    const result = await db.pool.query(query);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "ID is required!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from children where id=$1)',
      values: [id]
    });

    const idExists = checkIfExists?.rows[0].exists;

    if (!idExists) {
      return res.status(400).json({ message: "Child does not exist!" });
    }

    const query = {
      text: 'DELETE FROM children where id=$1',
      values: [id]
    }

    const result = await db.pool.query(query);

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Child not found!" });
    }

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}