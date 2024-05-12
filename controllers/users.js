const db = require("../services/database");
const { encryptPassword, comparePassword } = require("../services/passwords");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * from users");

    return res.status(200).json({
      log_trace: "ctrlr/users/getAllUsers",
      data: result?.rows
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(422).json({ error: "Email is required!" });
    }

    const result = await db.pool.query({
      text: 'SELECT * from users where email=$1',
      values: [email]
    });

    if (result?.rowCount === 0) {
      return res.status(400).json({ message: "Email does not exist!" });
    }

    return res.status(200).json({
      log_trace: "ctrlr/users/getUserByEmail",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, password, isParent, isMedicalProfessional } = req.body;

    if (!email) {
      return res.status(422).json({ error: "Email is required!" });
    }

    const checkIfExists = await db.pool.query({
      text: 'SELECT EXISTS (SELECT * from users where email=$1)',
      values: [email]
    });

    const emailAlreadyExists = checkIfExists?.rows[0].exists;

    if (emailAlreadyExists) {
      return res.status(200).json({ 
        data: null,
        message: "Email already exists!" 
      });
    }

    const encryptedPassword = await encryptPassword(password);

    const query = {
      text: 'INSERT INTO users(first_name, last_name, email, phone, birth_date, password, is_parent, is_medical_professional) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      values: [firstName, lastName, email, phone, birthDate, encryptedPassword, isParent, isMedicalProfessional]
    }

    const result = await db.pool.query(query);

    return res.status(201).json({
      log_trace: "ctrlr/users/createUser",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(422).json({ error: "Email is required!" });
    }

    const passwordQuery = {
      text: 'SELECT password from users where email=$1',
      values: [email]
    }

    const passwordCheck = await db.pool.query(passwordQuery);
    const dbPassword = passwordCheck.rows[0].password;

    const isMatch = await comparePassword(dbPassword, password);

    if (isMatch) {
      const query = {
        text: 'SELECT * from users where email=$1',
        values: [email]
      }
  
      const result = await db.pool.query(query);

      return res.status(201).json({
        log_trace: "ctrlr/users/signInUser",
        data: result?.rows[0]
      });
    } else {
      return res.status(200).json({
        log_trace: "ctrlr/users/signInUser",
        data: null,
        message: "Email or password has no matches!"
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

exports.updateUser = async (req, res) => {
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
      log_trace: "ctrlr/users/updateUser",
      data: result?.rows[0]
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}