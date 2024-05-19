const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create-or-update', userController.createOrUpdateUser);
router.get('/userCart/:userEmail', userController.getUserCart);
router.get('/fetchRole/:userEmail', userController.getUserRoleByEmail);

module.exports = router;
