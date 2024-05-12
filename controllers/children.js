const { getConsultationsByChildrenId } = require("../services/consultations");
const db = require("../services/database");
const { getKnownConditionsByChildrenId } = require("../services/knownConditions");
const { getVaccinationDatesByChildrenId } = require("../services/vaccinations");

exports.getAllChildren = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * from children");

    return res.status(200).json({
      log_trace: "ctrlr/children/getAllChildren",
      data: result?.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.getChildById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      text: 'SELECT * from children where id=$1',
      values: [id]
    }

    const result = await db.pool.query(query);

    const knownConditions = await getKnownConditionsByChildrenId(id);
    const consultations = await getConsultationsByChildrenId(id);
    const vaccinationDates = await getVaccinationDatesByChildrenId(id);

    const data = {
      child: result?.rows[0],
      knownConditions,
      consultations,
      vaccinationDates
    };

    return res.status(200).json({
      log_trace: "ctrlr/children/getChildById",
      data
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.getAllChildrenByParentId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      text: 'SELECT * from children where parent_id=$1',
      values: [id]
    }

    const result = await db.pool.query(query);

    return res.status(200).json({
      log_trace: "ctrlr/children/getAllChildrenByParentId",
      data: result?.rows
    });
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

    return res.status(201).json({
      log_trace: "ctrlr/children/createChild",
      data: result?.rows[0]
    });
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

    return res.status(201).json({
      log_trace: "ctrlr/children/updateChild",
      data: result?.rows[0]
    });
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

    return res.status(201).json({
      log_trace: "ctrlr/children/deleteChild",
      data: "Child successfully deleted!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}