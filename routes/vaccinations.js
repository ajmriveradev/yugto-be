const router = require('express').Router();

const vaccinationsCtrlr = require('../controllers/vaccinations');

router.get("/vaccinations", vaccinationsCtrlr.getAllVaccinationDates);
router.get("/vaccinations/:id", vaccinationsCtrlr.getVaccinationDateById);
router.post("/vaccinations", vaccinationsCtrlr.createVaccinationDate);
router.put("/vaccinations/:id", vaccinationsCtrlr.updateVaccinationDate);

module.exports = router;