const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return hashedPassword;
  } catch (error) {
    console.error("encryptPassword: ERROR - ", error.message);
  }
}

const comparePassword = async (dbPassword, userPassword) => {
  const isMatch = await bcrypt.compare(userPassword, dbPassword)

  console.log("isMatch: ", isMatch);
  
  return isMatch;
}

module.exports = {
  encryptPassword,
  comparePassword
}