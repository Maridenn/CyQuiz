const QuizModel = require('../models/quizModel');

const quizController = {
  async getAll(req, res) {
    try {
      const quizzes = req.user?.role === 'admin'
        ? await QuizModel.findAll()
        : await QuizModel.findPublished();
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getById(req, res) {
    try {
      const quiz = await QuizModel.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async create(req, res) {
    try {
      const { title, description, time_limit, is_published } = req.body;
      if (!title) return res.status(400).json({ message: 'Title required' });
      const quiz = await QuizModel.create({
        title, description, time_limit, is_published,
        created_by: req.user.id
      });
      res.status(201).json(quiz);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const quiz = await QuizModel.update(req.params.id, req.body);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      await QuizModel.delete(req.params.id);
      res.json({ message: 'Quiz deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = quizController;
