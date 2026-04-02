const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authMiddleware, quizController.getAll);
router.get('/:id', authMiddleware, quizController.getById);
router.post('/', authMiddleware, isAdmin, quizController.create);
router.put('/:id', authMiddleware, isAdmin, quizController.update);
router.delete('/:id', authMiddleware, isAdmin, quizController.delete);

module.exports = router;
