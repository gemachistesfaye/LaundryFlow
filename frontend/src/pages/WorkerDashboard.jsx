import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkerOrders, updateOrderStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import GreetingHeader from '../components/GreetingHeader';
import { motion } from 'framer-motion';

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

  const columns = [
    { id: 'assigned', title: 'To Do (Assigned)', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { id: 'washing', title: 'Washing', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'drying', title: 'Drying', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { id: 'ready', title: 'Ready / Done', color: 'bg-green-50 border-green-200 text-green-800' }
  ];

  return (
    <DashboardLayout title="Worker Operations">
      <div className="max-w-7xl mx-auto">
        <GreetingHeader name={user?.full_name} role={user?.role} />

        {loading ? <p className="text-gray-500">Loading your board...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map(col => {
              const colOrders = orders.filter(o => o.status === col.id);
              return (
                <div key={col.id} className="bg-gray-100 rounded-xl p-4 flex flex-col min-h-[500px]">
                  <h3 className={`font-bold text-sm mb-4 px-3 py-1 rounded-full border inline-flex w-max ${col.color}`}>
                    {col.title} ({colOrders.length})
                  </h3>
                  
                  <div className="flex-1 space-y-3">
                    {colOrders.length === 0 ? (
                      <div className="text-gray-400 text-sm text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">Empty</div>
                    ) : (
                      colOrders.map(order => {
                        const next = getNextStatus(order.status);
                        return (
                          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                            <p className="font-mono font-bold text-indigo-600 text-sm mb-1">{order.tracking_code}</p>
                            <p className="text-xs text-gray-500 mb-3">{order.item_count} items • {order.student_name}</p>
                            
                            {next ? (
                              <button onClick={() => handleUpdateStatus(order.id, next)} className="w-full py-2 bg-gray-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition flex justify-center items-center gap-1 shadow-sm">
                                Move to {next} →
                              </button>
                            ) : (
                              <div className="w-full py-2 bg-green-100 text-green-800 rounded-lg text-xs font-bold text-center border border-green-200">
                                ✓ Awaiting Delivery
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
