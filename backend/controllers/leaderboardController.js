const pool = require('../config/db');

const leaderboardController = {
  async getGlobal(req, res) {
    try {
      const { rows } = await pool.query(
        `SELECT u.id, u.username,
         COUNT(a.id) as total_attempts,
         SUM(a.score) as total_score,
         AVG(a.score) as avg_score,
         MAX(a.score) as best_score
         FROM users u
         JOIN attempts a ON u.id = a.user_id
         GROUP BY u.id, u.username
         ORDER BY total_score DESC
         LIMIT 20`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getByQuiz(req, res) {
    try {
      const { rows } = await pool.query(
        `SELECT u.username, a.score, a.correct_answers, a.total_questions, a.time_taken, a.completed_at
         FROM attempts a
         JOIN users u ON a.user_id = u.id
         WHERE a.quiz_id = $1
         ORDER BY a.score DESC, a.time_taken ASC
         LIMIT 20`,
        [req.params.quizId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = leaderboardController;
