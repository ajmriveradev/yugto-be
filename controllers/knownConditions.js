const db = require("../services/database");

exports.getAllKnownConditions = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * from known_conditions");

    return res.status(200).json({
      log_trace: "ctrlr/knownConditions/getAllKnownConditions",
      data: result?.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.getKnownConditionsByChildrenId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(422).json({ error: "ID is required!" });
    }

    const result = await db.pool.query({
      text: 'SELECT * from known_conditions where children_id=$1',
      values: [id]
    });

    if (result?.rowCount === 0) {
      return res.status(400).json({ message: "ID does not exist!" });
    }

    return res.status(200).json({
      log_trace: "ctrlr/knownConditions/getKnownConditionByChildrenId",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.createKnownCondition = async (req, res) => {
  try {
    const { childrenId, type, name } = req.body;

    if (!childrenId) {
      return res.status(422).json({ error: "ID is required!" });
    }

    const checkIfChildExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from children where id=$1)',
      values: [childrenId]
    });

    console.log("RESULT: ", checkIfChildExists);

    const childExists = checkIfChildExists?.rows[0].exists;

    if (!childExists) {
      return res.status(200).json({ message: "Child does not exist!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from known_conditions where type=$1 and name=$2 and children_id=$3)',
      values: [type, name, childrenId]
    });

    const knownConditionExists = checkIfExists?.rows[0].exists;

    if (knownConditionExists) {
      return res.status(200).json({ message: "Known Condition already exists for this child!" });
    }

    const query = {
      text: 'INSERT INTO known_conditions(children_id, type, name) VALUES($1, $2, $3) RETURNING *',
      values: [childrenId, type, name]
    }

    const result = await db.pool.query(query);

    return res.status(201).json({
      log_trace: "ctrlr/knownConditions/createKnownCondition",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.updateKnownCondition = async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ error: "ID is required!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from users where id=$1)',
      values: [id]
    });

    const idExists = checkIfExists?.rows[0].exists;

    if (!idExists) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const query = {
      text: 'UPDATE users SET first_name=$1, last_name=$2, phone=$3, birth_date=$4 where id=$5 RETURNING *',
      values: [firstName, lastName, phone, birthDate, id]
    }

    const result = await db.pool.query(query);

    return res.status(201).json({
      log_trace: "ctrlr/knownConditions/updateKnownCondition",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}