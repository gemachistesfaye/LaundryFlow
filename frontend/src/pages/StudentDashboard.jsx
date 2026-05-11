import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Plus, History, LogOut, Wallet } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getMyOrders(user.id);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Smart Wash Hub</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button 
            onClick={logout}
            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-bold">{user?.wallet_balance || 0} ETB</p>
            </div>
          </div>
          
          {/* Total Orders Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>

          {/* New Order Button */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
            <span className="font-semibold text-lg">New Laundry Request</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Your Laundry History</h2>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tracking ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-400">Loading history...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-400">No orders found yet.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-indigo-600">{order.tracking_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">{order.total_price} ETB</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
