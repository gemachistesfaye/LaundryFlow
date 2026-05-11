import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, createOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const colors = {
    submitted: { bg: '#fff3cd', color: '#856404' },
    assigned: { bg: '#cce5ff', color: '#004085' },
    washing: { bg: '#d4edda', color: '#155724' },
    drying: { bg: '#d1ecf1', color: '#0c5460' },
    ready: { bg: '#d4edda', color: '#155724' },
    out_for_delivery: { bg: '#e2e3f1', color: '#383d6e' },
    delivered: { bg: '#c3e6cb', color: '#1e7e34' },
    cancelled: { bg: '#f5c6cb', color: '#721c24' },
  };
  const c = colors[status] || { bg: '#eee', color: '#333' };
  return <span style={{ background: c.bg, color: c.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{status.replace(/_/g, ' ')}</span>;
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddItem = () => setItems([...items, { name: '', quantity: 1 }]);
  const handleItemChange = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = field === 'quantity' ? parseInt(val) || 1 : val;
    setItems(updated);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    const validItems = items.filter(i => i.name.trim());
    if (validItems.length === 0) return;
    try {
      await createOrder({ items: validItems, notes: '' });
      setShowModal(false);
      setItems([{ name: '', quantity: 1 }]);
      fetchOrders();
    } catch (err) { alert('Failed to create order'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#667eea' }}>🧺 Smart Wash Hub</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#555' }}>👤 {user?.full_name} <span style={{ background: '#667eea', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>Student</span></span>
          <button onClick={handleLogout} style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </nav>

      <main style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>Wallet Balance</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#667eea' }}>{user?.wallet_balance || 0} ETB</p>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>Total Orders</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#2ed573' }}>{orders.length}</p>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>Active</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#ffa502' }}>{orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}</p>
          </div>
        </div>

        {/* New Order Button */}
        <button onClick={() => setShowModal(true)} style={{ background: '#667eea', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
          + New Laundry Request
        </button>

        {/* Orders Table */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Your Orders</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', fontSize: 13, color: '#666' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tracking Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Items</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#999' }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#999' }}>No orders yet. Submit your first laundry request!</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#667eea' }}>{order.tracking_code}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.item_count} items</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={order.status} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>{order.total_price} ETB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* New Order Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 450, maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>New Laundry Request</h2>
            <form onSubmit={handleSubmitOrder}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input placeholder="Item name (e.g. T-shirt)" value={item.name} onChange={e => handleItemChange(i, 'name', e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 14 }} />
                  <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(i, 'quantity', e.target.value)}
                    style={{ width: 60, padding: '8px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 14, textAlign: 'center' }} />
                </div>
              ))}
              <button type="button" onClick={handleAddItem} style={{ background: 'none', color: '#667eea', border: '1.5px dashed #667eea', padding: '8px', borderRadius: 6, width: '100%', cursor: 'pointer', marginBottom: 16, fontSize: 13 }}>
                + Add another item
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
