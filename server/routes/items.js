const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

// Routes for Item
router.post('/', ItemController.createItem);
router.get('/', ItemController.getAllItems);
router.get('/approvedItems', ItemController.getApprovedItems);
router.put('/:id/suspend', ItemController.suspendItem);
router.get('/userEmail/:userEmail', ItemController.getAllItemsByUserEmail);
router.get('/:id', ItemController.getItemById);
router.patch('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

module.exports = router;
