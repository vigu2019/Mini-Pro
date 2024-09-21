const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.signInUser);

module.exports = router; 