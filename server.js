const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const deckRoutes = require('./api/routes/deckRoutes');
const favoriteRoutes = require('./api/routes/favoriteRoutes');
const errorHandler = require('./api/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());


// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();
// Routes
app.use('/api/decks', deckRoutes);
app.use('/api/favorites', favoriteRoutes);
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;