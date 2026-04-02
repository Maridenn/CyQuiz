const pool = require('../config/db');

const QuizModel = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT q.*, u.username as creator_name,
       COUNT(DISTINCT qu.id) as question_count
       FROM quizzes q
       LEFT JOIN users u ON q.created_by = u.id
       LEFT JOIN questions qu ON q.id = qu.quiz_id
       GROUP BY q.id, u.username
       ORDER BY q.created_at DESC`
    );
    return rows;
  },
  async findPublished() {
    const { rows } = await pool.query(
      `SELECT q.*, u.username as creator_name,
       COUNT(DISTINCT qu.id) as question_count
       FROM quizzes q
       LEFT JOIN users u ON q.created_by = u.id
       LEFT JOIN questions qu ON q.id = qu.quiz_id
       WHERE q.is_published = true
       GROUP BY q.id, u.username
       ORDER BY q.created_at DESC`
    );
    return rows;
  },
  async findById(id) {
    const { rows } = await pool.query(
      `SELECT q.*, u.username as creator_name FROM quizzes q
       LEFT JOIN users u ON q.created_by = u.id
       WHERE q.id = $1`, [id]
    );
    return rows[0];
  },
  async create({ title, description, created_by, time_limit, is_published }) {
    const { rows } = await pool.query(
      `INSERT INTO quizzes (title, description, created_by, time_limit, is_published)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, created_by, time_limit || 60, is_published || false]
    );
    return rows[0];
  },
  async update(id, { title, description, time_limit, is_published }) {
    const { rows } = await pool.query(
      `UPDATE quizzes SET title=$1, description=$2, time_limit=$3, is_published=$4
       WHERE id=$5 RETURNING *`,
      [title, description, time_limit, is_published, id]
    );
    return rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
  },
};

module.exports = QuizModel;
