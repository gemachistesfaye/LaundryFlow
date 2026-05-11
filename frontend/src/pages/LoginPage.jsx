import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ username, password });
      if (res.data.success) {
        loginUser(res.data.user, res.data.token);
        navigate(`/${res.data.user.role}/dashboard`);
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
        <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>🧺 Smart Wash Hub</h1>
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

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
          Student? <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
