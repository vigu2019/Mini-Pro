const travelController = require('../controllers/travel.controller');
const authUserMiddleware = require('../middleware/auth.user');
const express = require('express');
const router = express.Router();

router.get('/packages', authUserMiddleware, travelController.getPackageDetails);
router.get('/package/:id', authUserMiddleware, travelController.getEachPackageWithAgency);

module.exports = router;