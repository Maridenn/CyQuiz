require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS (optional server-side views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Simple EJS index page
app.get('/', (req, res) => {
  res.render('index', { title: 'Quiz App API' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
