const express = require('express');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middlewares/error.middleware');
const imageRoutes = require('./routes/image.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/output', express.static(path.join(__dirname, '../output')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/photos', imageRoutes);
// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
