const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.post('/create-or-update', userController.createOrUpdateUser);
router.get('/userCart/:userEmail', userController.getUserCart);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router;
