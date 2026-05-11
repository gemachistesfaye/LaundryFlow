import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getAnalytics, getAllOrders, createWorker, createDeliverer, assignWorker, getAllPayments, confirmPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(null); // 'worker' or 'deliverer'
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '', phone: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [a, u, o, p] = await Promise.all([getAnalytics(), getAllUsers(), getAllOrders(), getAllPayments()]);
      setAnalytics(a.data.analytics);
      setUsers(u.data.users);
      setOrders(o.data.orders);
      setPayments(p.data.payments);
    } catch (err) { console.error(err); }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const fn = showCreateModal === 'worker' ? createWorker : createDeliverer;
      const res = await fn(form);
      if (res.data.success) {
        setMsg(`${showCreateModal} created successfully!`);
        setForm({ username: '', email: '', password: '', full_name: '', phone: '' });
        loadData();
        setTimeout(() => { setShowCreateModal(null); setMsg(''); }, 1500);
      }
    } catch (err) { setMsg(err.response?.data?.message || 'Error creating account.'); }
  };

  const handleAssignWorker = async (orderId) => {
    const workers = users.filter(u => u.role === 'worker');
    if (workers.length === 0) return alert('No workers available. Create one first.');
    const workerId = prompt(`Enter worker ID:\n${workers.map(w => `${w.id}: ${w.full_name}`).join('\n')}`);
    if (!workerId) return;
    try {
      await assignWorker({ order_id: orderId, worker_id: parseInt(workerId) });
      loadData();
    } catch (err) { alert('Failed to assign worker.'); }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await confirmPayment({ payment_id: paymentId, status: 'confirmed' });
      loadData();
    } catch (err) { alert('Failed to confirm payment.'); }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      await confirmPayment({ payment_id: paymentId, status: 'rejected' });
      loadData();
    } catch (err) { alert('Failed to reject payment.'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const tabs = ['analytics', 'orders', 'users', 'payments'];

  return (
    <DashboardLayout title="Admin Overview">

      {/* Tab Navigation */}
      <div style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #eee', display: 'flex', gap: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'capitalize',
              color: tab === t ? '#667eea' : '#999', borderBottom: tab === t ? '3px solid #667eea' : '3px solid transparent' }}>
            {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowCreateModal('worker')} style={{ margin: '8px 4px', background: '#e17055', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Worker</button>
        <button onClick={() => setShowCreateModal('deliverer')} style={{ margin: '8px 0', background: '#0984e3', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Deliverer</button>
      </div>

      <main style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { label: 'Students', value: analytics.totalStudents, color: '#667eea' },
              { label: 'Workers', value: analytics.totalWorkers, color: '#e17055' },
              { label: 'Deliverers', value: analytics.totalDeliverers, color: '#0984e3' },
              { label: 'Total Orders', value: analytics.totalOrders, color: '#2ed573' },
              { label: 'Pending', value: analytics.pendingOrders, color: '#ffa502' },
              { label: 'Completed', value: analytics.completedOrders, color: '#1dd1a1' },
              { label: 'Revenue', value: `${analytics.totalRevenue || 0} ETB`, color: '#6c5ce7' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${stat.color}` }}>
                <p style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>{stat.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value ?? 0}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', fontSize: 13, color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tracking</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Worker</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#667eea' }}>{order.tracking_code}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.student_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.worker_name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize', fontWeight: 600 }}>{order.status.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {order.status === 'submitted' && (
                        <button onClick={() => handleAssignWorker(order.id)}
                          style={{ background: '#667eea', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                          Assign Worker
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', fontSize: 13, color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{u.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{u.full_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace' }}>{u.username}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                        background: u.role === 'admin' ? '#1a1a2e' : u.role === 'worker' ? '#e17055' : u.role === 'deliverer' ? '#0984e3' : '#667eea',
                        color: '#fff' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#999' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments Tab */}
        {tab === 'payments' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', fontSize: 13, color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Method</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: 30, color: '#999' }}>No payments found.</td></tr>
                ) : payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{p.student_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize' }}>{p.payment_method}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#999' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>{p.amount} ETB</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#fff', background: p.status === 'confirmed' ? '#1dd1a1' : p.status === 'pending' ? '#ffa502' : '#ff4757' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {p.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button onClick={() => handleConfirmPayment(p.id)} style={{ background: '#1dd1a1', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✓</button>
                          <button onClick={() => handleRejectPayment(p.id)} style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✗</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create Worker/Deliverer Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 420 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textTransform: 'capitalize' }}>Create {showCreateModal} Account</h2>
            {msg && <div style={{ padding: '10px', background: msg.includes('success') ? '#d4edda' : '#f8d7da', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{msg}</div>}
            <form onSubmit={handleCreateAccount}>
              {['full_name', 'username', 'email', 'phone', 'password'].map(f => (
                <div key={f} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>{f.replace('_', ' ')}</label>
                  <input name={f} type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
                    value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                    required={f !== 'phone'}
                    style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => { setShowCreateModal(null); setMsg(''); }} style={{ flex: 1, padding: 10, background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, background: showCreateModal === 'worker' ? '#e17055' : '#0984e3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
