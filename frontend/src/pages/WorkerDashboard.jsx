import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkerOrders, updateOrderStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await getWorkerOrders();
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ order_id: orderId, status: newStatus });
      fetchOrders();
    } catch (err) { alert('Failed to update status'); }
  };

  const getNextStatus = (current) => {
    const flow = { assigned: 'washing', washing: 'drying', drying: 'ready' };
    return flow[current] || null;
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <DashboardLayout title="Worker Panel">

      <main style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Assigned Laundry Tasks ({orders.length})</h2>

        {loading ? <p style={{ color: '#999' }}>Loading tasks...</p> :
          orders.length === 0 ? <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center', color: '#999' }}>No tasks assigned yet.</div> :
          orders.map(order => {
            const next = getNextStatus(order.status);
            return (
              <div key={order.id} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#e17055', fontSize: 15 }}>{order.tracking_code}</p>
                  <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Student: {order.student_name} • {order.item_count} items</p>
                  <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>Current: <strong style={{ textTransform: 'capitalize' }}>{order.status}</strong></p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Status Progress */}
                  {['assigned', 'washing', 'drying', 'ready'].map((s, i) => (
                    <div key={s} style={{ width: 12, height: 12, borderRadius: '50%', background: ['assigned', 'washing', 'drying', 'ready'].indexOf(order.status) >= i ? '#2ed573' : '#ddd' }} title={s} />
                  ))}
                  {next && (
                    <button onClick={() => handleUpdateStatus(order.id, next)}
                      style={{ marginLeft: 12, background: '#2ed573', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>
                      → {next}
                    </button>
                  )}
                  {order.status === 'ready' && <span style={{ marginLeft: 8, color: '#2ed573', fontWeight: 700, fontSize: 13 }}>✓ Awaiting Delivery</span>}
                </div>
              </div>
            );
          })
        }
      </main>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
