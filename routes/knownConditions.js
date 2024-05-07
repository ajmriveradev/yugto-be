const router = require('express').Router();

const knownConditionsCtrlr = require('../controllers/knownConditions');

router.get("/known-conditions", knownConditionsCtrlr.getAllKnownConditions);
router.get("/known-conditions/:childrenId", knownConditionsCtrlr.getKnownConditionByChildrenId);
router.post("/known-conditions", knownConditionsCtrlr.createKnownCondition);
router.put("/known-conditions/:id", knownConditionsCtrlr.updateKnownCondition);

module.exports = router;