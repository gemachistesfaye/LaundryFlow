const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

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

// POST /api/auth/supabase-login
exports.supabaseLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Supabase token is required.' });
  }

  try {
    // 1. Verify the token with Supabase to get user details
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid Supabase token.' });
    }

    const email = user.email;
    // Generate a default username if one doesn't exist
    const username = user.user_metadata.name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
    const full_name = user.user_metadata.full_name || user.user_metadata.name || 'Google User';

    // 2. Check if the user already exists in your MySQL database
    let [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let mysqlUser = rows[0];

    if (!mysqlUser) {
      // Create user in MySQL (default to 'student' role)
      const placeholderPasswordHash = ''; // No password needed for Google OAuth users
      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, placeholderPasswordHash, 'student', full_name, '']
      );

      // Fetch the newly inserted user
      const [newRows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      mysqlUser = newRows[0];
    }

    // 3. Issue a standard backend JWT token
    const backendToken = jwt.sign(
      { userId: mysqlUser.id, role: mysqlUser.role, username: mysqlUser.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: backendToken,
      user: {
        id: mysqlUser.id,
        username: mysqlUser.username,
        email: mysqlUser.email,
        role: mysqlUser.role,
        full_name: mysqlUser.full_name,
        wallet_balance: mysqlUser.wallet_balance
      }
    });

  } catch (error) {
    console.error('Supabase Login Sync Error:', error);
    res.status(500).json({ success: false, message: 'Server error during social login.' });
  }
};

