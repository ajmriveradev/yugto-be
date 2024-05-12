const db = require("../services/database");

const getConsultationsByChildrenId = async (childrenId) => {
  const result = await db.pool.query({
    text: 'SELECT * from consultations where children_id=$1 order by created_at desc',
    values: [childrenId]
  });

  if (result?.rowCount === 0) {
    return null
  }

  return result.rows;
}

module.exports = {
  getConsultationsByChildrenId
}