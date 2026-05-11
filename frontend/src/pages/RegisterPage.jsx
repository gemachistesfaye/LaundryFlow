import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      if (res.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Create Student Account</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 13 }}>Only students can self-register</p>

        {error && <div style={{ background: '#fee', color: '#c00', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'john@university.edu' },
            { name: 'phone', label: 'Phone (optional)', type: 'text', placeholder: '+251...' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>{field.label}</label>
              <input
                name={field.name} type={field.type} value={form[field.name]} onChange={handleChange}
                required={field.name !== 'phone'} placeholder={field.placeholder}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#999' : '#667eea', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
