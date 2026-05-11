import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, createOrder, getMyPayments, createPayment } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

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
  const [payments, setPayments] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'payments'

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [oRes, pRes] = await Promise.all([getMyOrders(), getMyPayments()]);
      setOrders(oRes.data.orders);
      setPayments(pRes.data.payments);
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
      setShowOrderModal(false);
      setItems([{ name: '', quantity: 1 }]);
      fetchData();
    } catch (err) { alert('Failed to create order'); }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount) return;
    try {
      // Find an unpaid order to attach the payment to, or just make a general payment (order_id null if general, but schema requires order_id currently? Let's just use the first pending order or a dummy if none)
      const pendingOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled');
      if (!pendingOrder) return alert("You don't have any active orders to pay for.");
      
      await createPayment({ order_id: pendingOrder.id, amount: paymentAmount, payment_method: 'telebirr' });
      setShowPaymentModal(false);
      setPaymentAmount('');
      fetchData();
      alert('Payment submitted for confirmation!');
    } catch (err) { alert('Failed to submit payment'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <DashboardLayout title="Student Dashboard">
      <main className="max-w-5xl mx-auto">
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
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>Pending Payments</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#ffa502' }}>{payments.filter(p => p.status === 'pending').length}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setShowOrderModal(true)} style={{ background: '#667eea', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            + New Laundry Request
          </button>
          <button onClick={() => setShowPaymentModal(true)} style={{ background: '#1dd1a1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            💳 Add Funds / Pay
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, borderBottom: '1px solid #ddd' }}>
          <button onClick={() => setActiveTab('orders')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '3px solid #667eea' : '3px solid transparent', fontWeight: 600, fontSize: 15, cursor: 'pointer', color: activeTab === 'orders' ? '#333' : '#999' }}>My Orders</button>
          <button onClick={() => setActiveTab('payments')} style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'payments' ? '3px solid #667eea' : '3px solid transparent', fontWeight: 600, fontSize: 15, cursor: 'pointer', color: activeTab === 'payments' ? '#333' : '#999' }}>Payment History</button>
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {activeTab === 'orders' ? (
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
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', fontSize: 13, color: '#666' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Order Tracking</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Method</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#999' }}>No payment history.</td></tr>
                ) : payments.map(payment => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#666' }}>{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#667eea' }}>{payment.tracking_code || 'N/A'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize' }}>{payment.payment_method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#fff', background: payment.status === 'confirmed' ? '#1dd1a1' : payment.status === 'pending' ? '#ffa502' : '#ff4757' }}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>{payment.amount} ETB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* New Order Modal */}
      {showOrderModal && (
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
                <button type="button" onClick={() => setShowOrderModal(false)} style={{ flex: 1, padding: 10, background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Submit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 400 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Submit Payment</h2>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Transfer funds to <strong>CBE: 1000123456789</strong> or <strong>Telebirr: 0911234567</strong>, then enter the amount here for admin approval.</p>
            <form onSubmit={handleSubmitPayment}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Amount Paid (ETB)</label>
                <input type="number" min="1" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} required
                  style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: 10, background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#1dd1a1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
