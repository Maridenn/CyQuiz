const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ message: 'All fields required' });

      const existing = await UserModel.findByEmail(email);
      if (existing) return res.status(409).json({ message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ username, email, password: hashed });

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is missing in your .env file' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7*24*60*60*1000
      });
      res.status(201).json({ user, token });
    } catch (err) {
      console.error('REGISTER ERROR:', err.message);
      res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: 'Email and password required' });

      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not set in .env!');
        return res.status(500).json({ message: 'JWT_SECRET is missing in your .env file' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7*24*60*60*1000
      });
      res.json({
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      console.error('LOGIN ERROR:', err.message);
      res.status(500).json({ message: err.message });
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user });
    } catch (err) {
      console.error('ME ERROR:', err.message);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = authController;
