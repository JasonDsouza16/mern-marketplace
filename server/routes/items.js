const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/itemController');

// Routes for Item
router.post('/', ItemController.createItem);
router.get('/', ItemController.getAllItems);
router.get('/userEmail/:userEmail', ItemController.getAllItemsByUserEmail);
router.get('/:id', ItemController.getItemById);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

module.exports = router;
