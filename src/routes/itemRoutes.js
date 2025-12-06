const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/itemController');

router.post('/', upload, ctrl.createItem);
router.post('/bulk', ctrl.bulkCreateItems);
router.get('/', ctrl.getAllItems);
router.get('/category/:categoryId', ctrl.getItemsByCategory);
router.get('/:id', ctrl.getItemById);
router.put('/:id', upload, ctrl.updateItem);
router.patch('/:id/toggle', ctrl.toggleAvailability);
router.delete('/:id', ctrl.deleteItem);

module.exports = router;