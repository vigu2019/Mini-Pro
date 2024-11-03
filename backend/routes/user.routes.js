const userController = require('../controllers/user.controller');
const authUserMiddleware = require('../middleware/auth.user');
const express = require('express');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.signInUser);
router.get('/logout', authUserMiddleware, userController.logoutUser);

module.exports = router; 