const router = require('express').Router();

const consultationsCtrlr = require('../controllers/consultations');

router.get("/consultations", consultationsCtrlr.getAllConsultations);
router.get("/consultations/:id", consultationsCtrlr.getConsultationById);
router.post("/consultations", consultationsCtrlr.createConsultation);
router.put("/consultations/:id", consultationsCtrlr.updateConsultation);

module.exports = router;