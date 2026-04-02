const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/quiz/:quizId', authMiddleware, questionController.getByQuiz);
router.post('/', authMiddleware, isAdmin, questionController.create);
router.put('/:id', authMiddleware, isAdmin, questionController.update);
router.delete('/:id', authMiddleware, isAdmin, questionController.delete);

module.exports = router;
