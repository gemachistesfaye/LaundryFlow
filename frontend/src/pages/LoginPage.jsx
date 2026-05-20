import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loginUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ username, password });
      if (res.data.success) {
        loginUser(res.data.user, res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>🧺 LaundryFlow</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 30, fontSize: 14 }}>University Laundry Management System</p>

        {error && <div style={{ background: '#fee', color: '#c00', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Username</label>
          <input
            type="text" value={username} onChange={e => setUsername(e.target.value)} required
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, marginBottom: 16, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Enter your username"
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, marginBottom: 24, fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Enter your password"
          />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#999' : '#667eea', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#eee' }}></div>
          <span style={{ padding: '0 10px', fontSize: 12, color: '#aaa', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#eee' }}></div>
        </div>

        <button onClick={loginWithGoogle} type="button"
          style={{ width: '100%', padding: '12px', background: '#fff', border: '1.5px solid #ddd', borderRadius: 8, color: '#333', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
          <svg className="w-5 h-5" style={{ width: 20, height: 20 }} viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.54 28.55c-.48-1.45-.76-2.99-.76-4.55s.28-3.1.76-4.55l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666', marginBottom: 0 }}>
          Student? <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
