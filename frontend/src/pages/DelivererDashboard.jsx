import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeliveryTasks, acceptDeliveryTask, completeDelivery } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import GreetingHeader from '../components/GreetingHeader';
import { motion } from 'framer-motion';

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

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const activeTasks = tasks.filter(t => t.status === 'picked_up' || t.status === 'in_transit');

  return (
    <DashboardLayout title="Logistics Center">
      <div className="max-w-7xl mx-auto">
        <GreetingHeader name={user?.full_name} role={user?.role} />

        {loading ? <p className="text-gray-500">Loading delivery tasks...</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pending Pickups */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Ready for Pickup ({pendingTasks.length})
              </h2>
              <div className="space-y-4">
                {pendingTasks.length === 0 ? <p className="text-gray-400 text-sm">No tasks pending pickup.</p> :
                  pendingTasks.map(task => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={task.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-300 transition">
                      <div>
                        <p className="font-mono font-bold text-blue-600 text-sm">{task.tracking_code}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{task.student_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{task.item_count} items • {task.student_phone || 'No phone'}</p>
                      </div>
                      <button onClick={() => handleAccept(task.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
                        Accept
                      </button>
                    </motion.div>
                  ))
                }
              </div>
            </div>

            {/* Out for Delivery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Out for Delivery ({activeTasks.length})
              </h2>
              <div className="space-y-4">
                {activeTasks.length === 0 ? <p className="text-gray-400 text-sm">No active deliveries.</p> :
                  activeTasks.map(task => (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={task.id} className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-mono font-bold text-green-700 text-sm">{task.tracking_code}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{task.student_name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{task.item_count} items • {task.student_phone || 'No phone'}</p>
                      </div>
                      <button onClick={() => handleComplete(task.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition flex items-center gap-2">
                        ✓ Complete
                      </button>
                    </motion.div>
                  ))
                }
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DelivererDashboard;
