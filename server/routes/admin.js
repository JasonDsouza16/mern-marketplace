const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes for Admin
router.get('/isAdminCheck', adminController.isAdminCheck);

module.exports = router;
