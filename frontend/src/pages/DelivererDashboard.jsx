import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeliveryTasks, acceptDeliveryTask, completeDelivery } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const DelivererDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await getDeliveryTasks();
      setTasks(res.data.tasks);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAccept = async (taskId) => {
    try { await acceptDeliveryTask({ task_id: taskId }); fetchTasks(); }
    catch (err) { alert('Failed to accept task'); }
  };

  const handleComplete = async (taskId) => {
    try { await completeDelivery({ task_id: taskId }); fetchTasks(); }
    catch (err) { alert('Failed to complete delivery'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <DashboardLayout title="Deliverer Panel">

      <main style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Delivery Tasks ({tasks.length})</h2>

        {loading ? <p style={{ color: '#999' }}>Loading...</p> :
          tasks.length === 0 ? <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center', color: '#999' }}>No delivery tasks available.</div> :
          tasks.map(task => (
            <div key={task.id} style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0984e3', fontSize: 15 }}>{task.tracking_code}</p>
                <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Student: {task.student_name} • Phone: {task.student_phone || 'N/A'}</p>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{task.item_count} items • {task.total_price} ETB</p>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Status: <strong style={{ textTransform: 'capitalize' }}>{task.status.replace(/_/g, ' ')}</strong></p>
              </div>
              <div>
                {task.status === 'pending' && (
                  <button onClick={() => handleAccept(task.id)}
                    style={{ background: '#0984e3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Accept & Pick Up
                  </button>
                )}
                {(task.status === 'picked_up' || task.status === 'in_transit') && (
                  <button onClick={() => handleComplete(task.id)}
                    style={{ background: '#2ed573', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    ✓ Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </main>
    </DashboardLayout>
  );
};

export default DelivererDashboard;
