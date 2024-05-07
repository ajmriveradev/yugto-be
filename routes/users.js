const router = require('express').Router();

const usersCtrlr = require('../controllers/users');

router.get("/users", usersCtrlr.getAllUsers);
router.post("/users", usersCtrlr.createUser);
router.put("/users/:id", usersCtrlr.updateUser);

module.exports = router;