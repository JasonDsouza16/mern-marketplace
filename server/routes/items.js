const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

// Routes for Item
router.post('/', ItemController.createItem);
router.get('/', ItemController.getAllItems);
router.get('/approvedItems', ItemController.getApprovedItems);
router.get('/userEmail/:userEmail', ItemController.getAllItemsByUserEmail);
router.patch('/:id', ItemController.updateItem);

module.exports = router;
