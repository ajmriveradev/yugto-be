const router = require('express').Router();

const vaccinationsCtrlr = require('../controllers/users');

router.get("/users", vaccinationsCtrlr.getAllUsers);
router.get("/users/:email", vaccinationsCtrlr.getUserByEmail);
router.post("/users", vaccinationsCtrlr.createUser);
router.put("/users/:id", vaccinationsCtrlr.updateUser);

module.exports = router;