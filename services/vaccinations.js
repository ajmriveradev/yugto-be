const db = require("../services/database");

const getVaccinationDatesByChildrenId = async (childrenId) => {
  const result = await db.pool.query({
    text: 'SELECT * from vaccination_dates where children_id=$1 order by vaccination_date desc',
    values: [childrenId]
  });

  if (result?.rowCount === 0) {
    return null
  }

  return result.rows;
}

module.exports = {
  getVaccinationDatesByChildrenId,
}