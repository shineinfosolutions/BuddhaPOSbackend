require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://buddhapos.vercel.app',
    'https://buddha-po-sbackend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB only when needed
let isConnected = false;
const ensureConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Routes with connection check
app.use('/api/categories', async (req, res, next) => {
  await ensureConnection();
  next();
}, require('./routes/categoryRoutes'));

app.use('/api/items', async (req, res, next) => {
  await ensureConnection();
  next();
}, require('./routes/itemRoutes'));

app.use('/api/orders', async (req, res, next) => {
  await ensureConnection();
  next();
}, require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Buddha POS Backend API',
    endpoints: {
      categories: '/api/categories',
      items: '/api/items',
      orders: '/api/orders'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

// For Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;