const express = require('express');
const router = express.Router();
const authUserMiddleware = require('../middleware/auth.user');
const { getUserBookings, createBooking } = require('../controllers/booking.controller');

router.get('/view', authUserMiddleware, getUserBookings);
router.post('/create', authUserMiddleware, createBooking);

module.exports = router