const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, leaderboardController.getGlobal);
router.get('/quiz/:quizId', authMiddleware, leaderboardController.getByQuiz);

module.exports = router;
