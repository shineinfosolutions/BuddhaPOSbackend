const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

router.post('/', ctrl.createOrder);
router.get('/', ctrl.getOrders);
router.get('/search', ctrl.getOrders); // Alias for search
router.get('/:id', ctrl.getOrderById);
router.put('/:id', ctrl.updateOrder);
router.delete('/:id', ctrl.deleteOrder);

module.exports = router;