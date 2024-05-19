const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.put('/approve-item/:id', adminController.approveItem);
router.put('/disapprove-item/:id', adminController.disapproveItem);
router.get('/items', adminController.getAllItems);
router.get('/users', adminController.getAllUsers);
router.get('/isAdminCheck', adminController.isAdminCheck);

module.exports = router;
