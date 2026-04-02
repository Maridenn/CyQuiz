const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/submit', authMiddleware, attemptController.submit);
router.get('/my', authMiddleware, attemptController.getUserAttempts);
router.get('/all', authMiddleware, isAdmin, attemptController.getAllAttempts);
router.get('/:id', authMiddleware, attemptController.getById);

module.exports = router;
