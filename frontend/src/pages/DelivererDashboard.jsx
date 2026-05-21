import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock, MapPin, Navigation, Phone, ChevronRight, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getDeliveryTasks, acceptDeliveryTask, completeDelivery } from '../services/api';

const STATUS_COLORS = { pending:'#fbbf24', picked_up:'#818cf8', in_transit:'#22d3ee', delivered:'#10b981' };
const STATUS_LABELS = { pending:'Pending', picked_up:'Picked Up', in_transit:'In Transit', delivered:'Delivered' };

const Badge = ({ status }) => (
  <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:`${STATUS_COLORS[status]||'#818cf8'}18`, color:STATUS_COLORS[status]||'#818cf8', border:`1px solid ${STATUS_COLORS[status]||'#818cf8'}30` }}>
    {STATUS_LABELS[status] || status}
  </span>
);

export default function DelivererDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(null);

  const showToast = (text, type='success') => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const res = await getDeliveryTasks(); setTasks(res.data.tasks || []); }
    catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAccept = async (id) => {
    setUpdating(id);
    try {
      await acceptDeliveryTask({ task_id: id });
      showToast('Task accepted'); load();
    } catch (e) { showToast('Error accepting task', 'error'); }
    setUpdating(null);
  };

  const handleComplete = async (id) => {
    setUpdating(id);
    try {
      await completeDelivery({ task_id: id });
      showToast('Delivery completed!'); load();
    } catch (e) { showToast('Error completing delivery', 'error'); }
    setUpdating(null);
  };

  const pending = tasks.filter(t => t.status === 'pending').length;
  const active = tasks.filter(t => t.status !== 'pending' && t.status !== 'delivered').length;
  const done = tasks.filter(t => t.status === 'delivered').length;

  return (
    <DashboardLayout title="Delivery Panel" activeTab="Dashboard">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:28 }}>
        {[
          { icon: Clock, label:'Available Tasks', value: pending, color:'#fbbf24' },
          { icon: Truck, label:'My Deliveries', value: active, color:'#6366f1' },
          { icon: CheckCircle, label:'Completed', value: done, color:'#10b981' },
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

      <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:20 }}>
          <Truck size={16} style={{ display:'inline', marginRight:8, color:'#818cf8' }} />Delivery Tasks
        </h2>
        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'rgba(241,245,249,0.3)' }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <MapPin size={48} color="rgba(241,245,249,0.12)" style={{ margin:'0 auto 14px', display:'block' }} />
            <p style={{ color:'rgba(241,245,249,0.35)', fontSize:14 }}>No delivery tasks available right now.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {tasks.map(t => (
              <motion.div key={t.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <span style={{ fontWeight:700, color:'#f1f5f9', fontSize:14 }}>{t.tracking_code}</span>
                    <Badge status={t.status} />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12, color:'rgba(241,245,249,0.45)' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={12} color="#fbbf24"/> {t.student_name || 'Student'}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><Phone size={12} color="#818cf8"/> {t.student_phone || 'No phone'}</span>
                    <span>{t.item_count} items</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {t.status === 'pending' && (
                    <button onClick={() => handleAccept(t.id)} disabled={updating === t.id}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:12, border:'none', background:'rgba(99,102,241,0.15)', color:'#818cf8', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', border:'1px solid rgba(99,102,241,0.3)' }}>
                      {updating === t.id ? 'Accepting...' : 'Accept Task'}
                    </button>
                  )}
                  {t.status !== 'pending' && t.status !== 'delivered' && (
                    <button onClick={() => handleComplete(t.id)} disabled={updating === t.id}
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(16,185,129,0.3)' }}>
                      {updating === t.id ? 'Updating...' : 'Mark Delivered'} <CheckCircle size={14} />
                    </button>
                  )}
                  {t.status === 'delivered' && (
                    <span style={{ padding:'8px 16px', borderRadius:12, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399', fontSize:12, fontWeight:600 }}>Completed</span>
                  )}
                </div>
              </motion.div>
            ))}
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
