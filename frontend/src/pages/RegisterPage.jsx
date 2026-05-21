import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate(`/${user.role}/dashboard`); }, [user, navigate]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await register(form);
      if (res.data.success) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inp = (extra = {}) => ({
    width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    color: '#f1f5f9', fontSize: 14, fontFamily: 'Inter,sans-serif',
    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', ...extra
  });

  const focus = e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
  const blur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', fontFamily: 'Inter,sans-serif', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, background: '#6366f1', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.07 }} />
      <div style={{ position: 'absolute', bottom: -120, left: -120, width: 350, height: 350, background: '#8b5cf6', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.07 }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shirt size={22} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#f1f5f9', letterSpacing: '-0.5px' }}>LaundryFlow</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.7px', marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.4)', marginBottom: 28 }}>Join thousands of students on LaundryFlow</p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 18 }}>
            <AlertCircle size={15} color="#f87171" /><span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 500 }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 18 }}>
            <CheckCircle size={15} color="#34d399" /><span style={{ fontSize: 13, color: '#6ee7b7', fontWeight: 500 }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.6)', display: 'block', marginBottom: 7 }}>Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Full name" style={inp()} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.6)', display: 'block', marginBottom: 7 }}>Username</label>
              <input name="username" value={form.username} onChange={handleChange} required placeholder="Username" style={inp()} onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.6)', display: 'block', marginBottom: 7 }}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@university.edu" style={inp()} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.6)', display: 'block', marginBottom: 7 }}>Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9XX XXX XXXX" style={inp()} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.6)', display: 'block', marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required placeholder="Min. 8 characters" style={inp({ paddingRight: 44 })} onFocus={focus} onBlur={blur} />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.35)', padding: 0, display: 'flex' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(99,102,241,0.3)', transition: 'all 0.2s', marginTop: 4, fontFamily: 'inherit' }}>
            {loading ? <><span className="spin-reg" /> Registering...</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(241,245,249,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
      <style>{`.spin-reg{width:16px;height:16px;border:2px solid rgba(255,255,255,0.2);border-top-color:white;border-radius:50%;animation:sp 0.7s linear infinite;display:inline-block}@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
