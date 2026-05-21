import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, Clock, Package, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getWorkerOrders, updateOrderStatus } from '../services/api';

const STATUS_FLOW = ['assigned', 'washing', 'drying', 'ready'];
const STATUS_COLORS = { assigned:'#fbbf24', washing:'#22d3ee', drying:'#fb923c', ready:'#34d399' };
const STATUS_LABELS = { assigned:'Assigned', washing:'Washing', drying:'Drying', ready:'Ready' };

const Badge = ({ status }) => (
  <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${STATUS_COLORS[status]||'#818cf8'}18`, color:STATUS_COLORS[status]||'#818cf8', border:`1px solid ${STATUS_COLORS[status]||'#818cf8'}30` }}>
    {STATUS_LABELS[status] || status}
  </span>
);

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(null);

  const showToast = (text, type='success') => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const res = await getWorkerOrders(); setOrders(res.data.orders || []); }
    catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const advance = async (order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    setUpdating(order.id);
    try {
      await updateOrderStatus({ order_id: order.id, status: next });
      showToast(`Order marked as ${STATUS_LABELS[next]}`);
      load();
    } catch (e) { showToast(e.response?.data?.message || 'Update failed', 'error'); }
    setUpdating(null);
  };

  const done = orders.filter(o => o.status === 'ready').length;
  const active = orders.filter(o => o.status !== 'ready').length;

  return (
    <DashboardLayout title={`Worker Panel`} activeTab="Dashboard">
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 }}>
        {[
          { icon: Package, label:'Total Assigned', value: orders.length, color:'#6366f1' },
          { icon: Clock, label:'In Progress', value: active, color:'#f59e0b' },
          { icon: CheckCircle, label:'Ready', value: done, color:'#10b981' },
        ].map((s, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'20px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}18`, border:`1px solid ${s.color}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:'#f1f5f9' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)', fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:20 }}>
          <Wrench size={16} style={{ display:'inline', marginRight:8, color:'#818cf8' }} />My Work Queue
        </h2>
        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'rgba(241,245,249,0.3)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <CheckCircle size={48} color="rgba(241,245,249,0.12)" style={{ margin:'0 auto 14px', display:'block' }} />
            <p style={{ color:'rgba(241,245,249,0.35)', fontSize:14 }}>No orders assigned yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {orders.map(o => {
              const idx = STATUS_FLOW.indexOf(o.status);
              const canAdvance = idx >= 0 && idx < STATUS_FLOW.length - 1;
              const nextLabel = canAdvance ? STATUS_LABELS[STATUS_FLOW[idx+1]] : null;
              return (
                <motion.div key={o.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <span style={{ fontWeight:700, color:'#f1f5f9', fontSize:14 }}>{o.tracking_code}</span>
                      <Badge status={o.status} />
                    </div>
                    <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)' }}>
                      Student: {o.student_name || '—'} · {o.item_count} items · {o.total_price} ETB
                    </div>
                    {o.notes && <div style={{ fontSize:12, color:'rgba(241,245,249,0.3)', marginTop:4, fontStyle:'italic' }}>"{o.notes}"</div>}
                  </div>
                  {canAdvance && (
                    <button onClick={() => advance(o)} disabled={updating === o.id}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', opacity: updating===o.id ? 0.6 : 1 }}>
                      {updating === o.id ? 'Updating...' : `Mark as ${nextLabel}`} <ChevronRight size={14} />
                    </button>
                  )}
                  {o.status === 'ready' && (
                    <span style={{ padding:'8px 16px', borderRadius:12, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)', color:'#34d399', fontSize:12, fontWeight:700 }}>✓ Ready for Pickup</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'14px 20px', borderRadius:14, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:10, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', background: toast.type==='success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${toast.type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`, color: toast.type==='success' ? '#6ee7b7' : '#fca5a5' }}>
          {toast.type==='success'?<CheckCircle size={16}/>:<X size={16}/>} {toast.text}
        </div>
      )}
    </DashboardLayout>
  );
}
