const router = require('express').Router();

const usersCtrlr = require('../controllers/users');

router.get("/users", usersCtrlr.getAllUsers);

module.exports = router;