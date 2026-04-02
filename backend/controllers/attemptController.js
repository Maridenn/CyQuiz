const pool = require('../config/db');

const attemptController = {
  async submit(req, res) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { quiz_id, answers, time_taken } = req.body;
      // answers: [{ question_id, selected_answer }]

      // Get correct answers
      const { rows: questions } = await client.query(
        'SELECT id, correct_answer, points FROM questions WHERE quiz_id = $1', [quiz_id]
      );

      let score = 0;
      let correct_answers = 0;
      const answerMap = {};
      answers.forEach(a => { answerMap[a.question_id] = a.selected_answer; });

      questions.forEach(q => {
        if (answerMap[q.id] === q.correct_answer) {
          score += q.points;
          correct_answers++;
        }
      });

      const { rows: attemptRows } = await client.query(
        `INSERT INTO attempts (user_id, quiz_id, score, total_questions, correct_answers, time_taken)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [req.user.id, quiz_id, score, questions.length, correct_answers, time_taken || 0]
      );
      const attempt = attemptRows[0];

      // Store individual answers
      for (const a of answers) {
        const q = questions.find(q => q.id === a.question_id);
        const is_correct = q && a.selected_answer === q.correct_answer;
        await client.query(
          `INSERT INTO attempt_answers (attempt_id, question_id, selected_answer, is_correct)
           VALUES ($1,$2,$3,$4)`,
          [attempt.id, a.question_id, a.selected_answer, is_correct]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({
        attempt_id: attempt.id,
        score,
        total_questions: questions.length,
        correct_answers,
        percentage: questions.length > 0 ? Math.round((correct_answers / questions.length) * 100) : 0
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },

  async getUserAttempts(req, res) {
    try {
      const { rows } = await pool.query(
        `SELECT a.*, q.title as quiz_title FROM attempts a
         JOIN quizzes q ON a.quiz_id = q.id
         WHERE a.user_id = $1 ORDER BY a.completed_at DESC`,
        [req.user.id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getById(req, res) {
    try {
      const { rows } = await pool.query(
        `SELECT a.*, q.title as quiz_title, u.username FROM attempts a
         JOIN quizzes q ON a.quiz_id = q.id
         JOIN users u ON a.user_id = u.id
         WHERE a.id = $1`, [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ message: 'Attempt not found' });

      // Get answers with question details
      const { rows: answers } = await pool.query(
        `SELECT aa.*, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer,
                q.explanation, q.study_link
         FROM attempt_answers aa
         JOIN questions q ON aa.question_id = q.id
         WHERE aa.attempt_id = $1`, [req.params.id]
      );

      res.json({ ...rows[0], answers });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getAllAttempts(req, res) {
    try {
      const { rows } = await pool.query(
        `SELECT a.*, q.title as quiz_title, u.username FROM attempts a
         JOIN quizzes q ON a.quiz_id = q.id
         JOIN users u ON a.user_id = u.id
         ORDER BY a.completed_at DESC LIMIT 100`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = attemptController;
