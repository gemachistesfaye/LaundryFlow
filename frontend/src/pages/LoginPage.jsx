import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Eye, EyeOff, LogIn, AlertCircle, Zap } from 'lucide-react';
import { login, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();
  const { user, loginUser, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) navigate(`/${user.role}/dashboard`);
  }, [user, navigate]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (requirePasswordChange) {
        if (!newPassword || newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await changePassword({ userId, newPassword });
        // Automatically login with new password
        const res = await login({ username: form.username, password: newPassword });
        if (res.data.success) loginUser(res.data.user, res.data.token);
      } else {
        const res = await login(form);
        if (res.data.requirePasswordChange) {
          setRequirePasswordChange(true);
          setUserId(res.data.userId);
        } else if (res.data.success) {
          loginUser(res.data.user, res.data.token);
        }
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0a0f', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'none', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0d0d1a 0%, #111128 100%)' }} className="left-panel">
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: '#6366f1', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12 }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, background: '#8b5cf6', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 16px 40px rgba(99,102,241,0.4)' }}>
            <Shirt size={32} color="white" />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#f1f5f9', marginBottom: 16, textAlign: 'center' }}>LaundryFlow</h2>
          <p style={{ fontSize: 16, color: 'rgba(241,245,249,0.5)', textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>The complete university laundry management system. Real-time tracking, smart delivery, AI assistance.</p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
            {['Real-time order tracking', 'AI-powered assistant', 'Secure digital payments', 'Zero lost items guarantee'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={11} color="#818cf8" />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(241,245,249,0.65)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: '#6366f1', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.06 }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* Mobile Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shirt size={22} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#f1f5f9', letterSpacing: '-0.5px' }}>LaundryFlow</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px', color: '#f1f5f9', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.45)', marginBottom: 32 }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', marginBottom: 20 }}>
              <AlertCircle size={15} color="#f87171" />
              <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!requirePasswordChange ? (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.65)', display: 'block', marginBottom: 8 }}>Username</label>
                  <input name="username" value={form.username} onChange={handleChange} required autoComplete="username"
                    placeholder="Enter your username" className="pro-input"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.65)', display: 'block', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                      placeholder="Enter your password"
                      style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.35)', padding: 0, display: 'flex' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <p style={{ fontSize: 14, color: '#fca5a5', marginBottom: 16, background: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                  You must set a new secure password before accessing your dashboard.
                </p>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.65)', display: 'block', marginBottom: 8 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="newPassword" type={showPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(241,245,249,0.35)', padding: 0, display: 'flex' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(99,102,241,0.3)', transition: 'all 0.2s', marginTop: 4 }}>
              {loading ? <span className="spinner" /> : requirePasswordChange ? <>Update Password & Login</> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 12, color: 'rgba(241,245,249,0.3)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button onClick={loginWithGoogle} type="button"
            style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(241,245,249,0.75)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(241,245,249,0.75)'; }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.54 28.55c-.48-1.45-.76-2.99-.76-4.55s.28-3.1.76-4.55l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.23z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'rgba(241,245,249,0.4)' }}>
            New student?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) { .left-panel { display: flex !important; flex-direction: column; } }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
