const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js');

router.post('/register', userController.register);
router.get('/', userController.getAll);

module.exports = router;
