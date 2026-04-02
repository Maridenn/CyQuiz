const pool = require('../config/db');

const questionController = {
  async getByQuiz(req, res) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY order_num, id',
        [req.params.quizId]
      );
      // Hide correct answer, explanation, study_link during quiz (revealed only on result page)
      if (req.user?.role !== 'admin') {
        const sanitized = rows.map(({ correct_answer, explanation, study_link, ...q }) => q);
        return res.json(sanitized);
      }
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async create(req, res) {
    try {
      const { quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, order_num, explanation, study_link } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points, order_num, explanation, study_link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, points || 10, order_num || 0, explanation || null, study_link || null]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const { question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation, study_link } = req.body;
      const { rows } = await pool.query(
        `UPDATE questions SET question_text=$1, option_a=$2, option_b=$3, option_c=$4, option_d=$5,
         correct_answer=$6, points=$7, explanation=$8, study_link=$9 WHERE id=$10 RETURNING *`,
        [question_text, option_a, option_b, option_c, option_d, correct_answer, points, explanation || null, study_link || null, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ message: 'Question not found' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      await pool.query('DELETE FROM questions WHERE id = $1', [req.params.id]);
      res.json({ message: 'Question deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = questionController;
