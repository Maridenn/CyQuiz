const pool = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },
  async findById(id) {
    const { rows } = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    return rows[0];
  },
  async create({ username, email, password }) {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role',
      [username, email, password]
    );
    return rows[0];
  },
  async findAll() {
    const { rows } = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },
};

module.exports = UserModel;
