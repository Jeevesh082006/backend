const express = require('express');
const router = express.Router();

const UserController = require('../controller/usercontroller');

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/getAllUsers', UserController.getAllUsers);

module.exports = router;