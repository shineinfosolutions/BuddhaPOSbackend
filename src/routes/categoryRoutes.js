const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');

router.post('/', ctrl.createCategory);
router.get('/', ctrl.getAllCategories);
router.get('/:id', ctrl.getCategoryById);
router.put('/:id', ctrl.updateCategory);
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;