const express = require('express'); 
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifyAdmin = require('../middleware/auth.admin');
const verifyToken = require('../middleware/auth.user');

router.get('/users', verifyToken,  adminController.getAllUsers);
router.delete('/users/:id', verifyToken,  adminController.deleteUserById);
router.get('/bookings',verifyToken,  adminController.getAllBookings);
router.put('/bookings/:bookingId',verifyToken,  adminController.updateBookingStatus);
router.get('/packages',  verifyToken,adminController.getAllPackages);
router.post('/packages',verifyToken,  adminController.addPackage);
router.delete('/packages/:packageId',verifyToken,  adminController.deletePackageById);

module.exports = router;
