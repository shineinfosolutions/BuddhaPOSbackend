const Order = require('../models/Order');
const { buildQueryOptions, buildCompleteQuery } = require('../utils/queryHelper');

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp.slice(-6)}${random}`;
};

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      orderId: generateOrderId()
    };
    const newOrder = await Order.create(orderData);
    res.status(201).json({ message: 'Order Created', data: newOrder });
  } catch (error) { next(error); }
};

exports.getOrders = async (req, res, next) => {
  try {
    // Simple test - get all orders without any filters
    const allOrders = await Order.find({});
    console.log('Total orders in DB:', allOrders.length);
    
    const { page, limit, skip } = buildQueryOptions(req);
    const query = buildCompleteQuery(req, ['customerName', 'customerMobile', 'orderId', 'items.itemName']);
    
    // Additional filters
    if (req.query.status) query.status = req.query.status;
    
    console.log('Query:', JSON.stringify(query));
    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) { next(error); }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) { next(error); }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (error) { next(error); }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) { next(error); }
};