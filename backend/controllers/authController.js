const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST /api/auth/register (Students only)
exports.register = async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password_hash, 'student', full_name, phone || '']
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. You can now login.',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND is_active = TRUE', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        wallet_balance: user.wallet_balance
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// GET /api/auth/me — get current user from token
exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, role, full_name, wallet_balance, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
