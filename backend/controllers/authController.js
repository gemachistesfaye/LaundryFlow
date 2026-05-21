const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db');

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, role: user.role, username: user.username },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

// POST /api/auth/register (Students only)
exports.register = async (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash, role: 'student', full_name, phone: phone || '' }])
      .select('id')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Registration successful. You can now login.',
      userId: data.id
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
    const { data: rows, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .limit(1);

    if (error) throw error;
    const user = rows && rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken(user);

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

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('users')
      .select('id, username, email, role, full_name, wallet_balance, created_at')
      .eq('id', req.user.userId)
      .limit(1);

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/auth/supabase-login (Google OAuth)
exports.supabaseLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Supabase token is required.' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid Supabase token.' });
    }

    const email = user.email;
    const username = user.user_metadata?.name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
    const full_name = user.user_metadata?.full_name || user.user_metadata?.name || 'Google User';

    let { data: rows } = await supabase.from('users').select('*').eq('email', email).limit(1);
    let dbUser = rows && rows[0];

    if (!dbUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ username, email, password_hash: '', role: 'student', full_name, phone: '' }])
        .select('*')
        .single();

      if (insertError) throw insertError;
      dbUser = newUser;
    }

    const backendToken = signToken(dbUser);

    res.json({
      success: true,
      token: backendToken,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        full_name: dbUser.full_name,
        wallet_balance: dbUser.wallet_balance
      }
    });
  } catch (error) {
    console.error('Supabase Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during social login.' });
  }
};
