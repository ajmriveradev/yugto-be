const router = require('express').Router();

const childrenCtrlr = require('../controllers/children');

router.get("/children", childrenCtrlr.getAllChildren);
router.get("/children/:id", childrenCtrlr.getChildById);
router.get("/children/parent/:id", childrenCtrlr.getAllChildrenByParentId);
router.post("/children", childrenCtrlr.createChild);
router.put("/children/:id", childrenCtrlr.updateChild);
router.delete("/children/:id", childrenCtrlr.deleteChild);

module.exports = router;