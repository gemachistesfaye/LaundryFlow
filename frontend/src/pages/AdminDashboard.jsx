import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Users, Package, CreditCard, Bot, Activity, CheckCircle, X, Plus, UserPlus, TrendingUp, Clock, Wrench, Truck } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getAnalytics, getAllOrders, getAllUsers, getAllPayments, createWorker, createDeliverer, assignWorker, assignDeliverer, confirmPayment, getAIInsights } from '../services/api';

const STATUS_COLORS = { submitted:'#818cf8',assigned:'#fbbf24',washing:'#22d3ee',drying:'#fb923c',ready:'#34d399',out_for_delivery:'#a78bfa',delivered:'#6ee7b7',pending:'#fbbf24',confirmed:'#10b981',rejected:'#ef4444' };

const Badge = ({ status }) => (
  <span style={{ padding:'3px 10px', borderRadius:999, fontSize:10, fontWeight:700, background:`${STATUS_COLORS[status]||'#818cf8'}18`, color:STATUS_COLORS[status]||'#818cf8', border:`1px solid ${STATUS_COLORS[status]||'#818cf8'}30`, textTransform:'uppercase' }}>
    {status.replace(/_/g, ' ')}
  </span>
);

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const setTab = (newTab) => setSearchParams({ tab: newTab });
  
  const [data, setData] = useState({ analytics:{}, orders:[], users:[], payments:[], insights:[] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [form, setForm] = useState({ username:'', email:'', password:'', full_name:'' });
  const [toast, setToast] = useState(null);

  const showToast = (text, type='success') => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [an, or, us, pa, ai] = await Promise.all([
        getAnalytics(), getAllOrders(), getAllUsers(), getAllPayments(), getAIInsights()
      ]);
      setData({ analytics: an.data.analytics||{}, orders: or.data.orders||[], users: us.data.users||[], payments: pa.data.payments||[], insights: ai.data.insights||[] });
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handleCreateAccount = async (e, role) => {
    e.preventDefault();
    try {
      if (role === 'worker') await createWorker(form);
      else await createDeliverer(form);
      setShowModal(null); setForm({ username:'', email:'', password:'', full_name:'' });
      showToast(`${role} account created!`); loadAll();
    } catch (err) { showToast(err.response?.data?.message || 'Error creating account', 'error'); }
  };

  const handleAssign = async (orderId, userId, role) => {
    try {
      if (role === 'worker') await assignWorker({ order_id: orderId, worker_id: userId });
      else await assignDeliverer({ order_id: orderId, deliverer_id: userId });
      showToast(`Assigned successfully`); loadAll();
    } catch { showToast('Assignment failed', 'error'); }
  };

  const handlePayment = async (paymentId, status) => {
    try {
      await confirmPayment({ payment_id: paymentId, status });
      showToast(`Payment ${status}`); loadAll();
    } catch { showToast('Error updating payment', 'error'); }
  };

  const workers = data.users.filter(u => u.role === 'worker');
  const deliverers = data.users.filter(u => u.role === 'deliverer');

  const tabLabelMap = { overview: 'Overview', orders: 'All Orders', users: 'Users', payments: 'Payments', ai: 'AI Insights' };

  return (
    <DashboardLayout title="Admin Control Center" activeTab={tabLabelMap[tab] || 'Overview'}>
      {/* Local Tab Bar Removed - Navigation handled by Sidebar */}

      {loading ? (
        <div style={{ textAlign:'center', padding:80, color:'rgba(241,245,249,0.3)' }}>Loading dashboard data...</div>
      ) : (
        <>
          {tab === 'overview' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              {[
                { label:'Total Revenue', value:`${data.analytics.totalRevenue || 0} ETB`, icon:CreditCard, color:'#10b981' },
                { label:'Total Orders', value:data.analytics.totalOrders || 0, icon:Package, color:'#6366f1' },
                { label:'Pending Orders', value:data.analytics.pendingOrders || 0, icon:Clock, color:'#fbbf24' },
                { label:'Total Students', value:data.analytics.totalStudents || 0, icon:Users, color:'#8b5cf6' },
                { label:'Active Workers', value:data.analytics.totalWorkers || 0, icon:Wrench, color:'#22d3ee' },
                { label:'Active Deliverers', value:data.analytics.totalDeliverers || 0, icon:Truck, color:'#f472b6' }
              ].map((s,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, padding:20, display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:`${s.color}15`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <s.icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:'#f1f5f9' }}>{s.value}</div>
                    <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)', fontWeight:500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'orders' && (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:800 }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>ORDER</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>STUDENT</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>STATUS</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>WORKER</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map(o => {
                      let meta = { note: o.notes, phone: o.student_phone || '', room: '', image_url: '' };
                      try { if (o.notes?.startsWith('{')) meta = JSON.parse(o.notes); } catch(e){}
                      return (
                      <tr key={o.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{o.tracking_code}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'rgba(241,245,249,0.6)' }}>
                          <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{o.student_name}</div>
                          {meta.phone && <div style={{ fontSize: 11, color: '#818cf8', marginTop: 2 }}>📞 {meta.phone}</div>}
                          {meta.room && <div style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}>🚪 Room {meta.room}</div>}
                          {meta.image_url && <a href={meta.image_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#f472b6', marginTop: 2, display: 'block', textDecoration: 'none' }}>🖼️ View Image</a>}
                          {meta.note && <div style={{ fontSize: 11, color: 'rgba(241,245,249,0.4)', marginTop: 4, fontStyle: 'italic' }}>"{meta.note}"</div>}
                        </td>
                        <td style={{ padding:'12px 16px' }}><Badge status={o.status} /></td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'rgba(241,245,249,0.6)' }}>{o.worker_name || '—'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          {o.status === 'submitted' && (
                            <select onChange={e => handleAssign(o.id, e.target.value, 'worker')} defaultValue="" style={{ padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f1f5f9', fontSize:12, outline:'none' }}>
                              <option value="" disabled>Assign Worker...</option>
                              {workers.map(w => <option key={w.id} value={w.id}>{w.full_name} ({w.active_orders || 0} active)</option>)}
                            </select>
                          )}
                          {o.status === 'ready' && (
                            <select onChange={e => handleAssign(o.id, e.target.value, 'deliverer')} defaultValue="" style={{ padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f1f5f9', fontSize:12, outline:'none' }}>
                              <option value="" disabled>Assign Deliverer...</option>
                              {deliverers.map(d => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                            </select>
                          )}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div style={{ display:'flex', gap:12, marginBottom:20 }}>
                <button onClick={() => setShowModal('worker')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:10, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399', fontSize:13, fontWeight:600, cursor:'pointer' }}><UserPlus size={15} /> Add Worker</button>
                <button onClick={() => setShowModal('deliverer')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:10, background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', color:'#fb923c', fontSize:13, fontWeight:600, cursor:'pointer' }}><UserPlus size={15} /> Add Deliverer</button>
              </div>
              <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>NAME</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>ROLE</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>EMAIL</th>
                      <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(u => (
                      <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding:'12px 16px', fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{u.full_name}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700, textTransform:'uppercase', background: u.role==='student'?'rgba(99,102,241,0.15)':u.role==='worker'?'rgba(16,185,129,0.15)':u.role==='deliverer'?'rgba(249,115,22,0.15)':'rgba(244,114,182,0.15)', color: u.role==='student'?'#818cf8':u.role==='worker'?'#34d399':u.role==='deliverer'?'#fb923c':'#f472b6' }}>{u.role}</span>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'rgba(241,245,249,0.5)' }}>{u.email}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'#f1f5f9' }}>{u.wallet_balance} ETB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>ORDER / STUDENT</th>
                    <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>AMOUNT</th>
                    <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>STATUS</th>
                    <th style={{ padding:'12px 16px', textAlign:'left', fontSize:11, color:'rgba(241,245,249,0.4)', fontWeight:600 }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map(p => (
                    <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9' }}>{p.tracking_code || 'Wallet Deposit'}</div>
                        <div style={{ fontSize:11, color:'rgba(241,245,249,0.4)' }}>{p.student_name}</div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:'#10b981' }}>{p.amount} ETB</td>
                      <td style={{ padding:'12px 16px' }}><Badge status={p.status} /></td>
                      <td style={{ padding:'12px 16px', display:'flex', gap:8 }}>
                        {p.status === 'pending' && (
                          <>
                            <button onClick={() => handlePayment(p.id, 'confirmed')} style={{ padding:'6px 10px', borderRadius:6, background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.3)', cursor:'pointer', fontSize:11, fontWeight:600 }}>Confirm</button>
                            <button onClick={() => handlePayment(p.id, 'rejected')} style={{ padding:'6px 10px', borderRadius:6, background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', cursor:'pointer', fontSize:11, fontWeight:600 }}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'ai' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {data.insights.map((ins, i) => (
                <div key={i} style={{ padding:'20px', borderRadius:16, background: ins.severity==='warning' ? 'rgba(245,158,11,0.05)' : ins.severity==='success' ? 'rgba(16,185,129,0.05)' : 'rgba(99,102,241,0.05)', border:`1px solid ${ins.severity==='warning'?'rgba(245,158,11,0.2)':ins.severity==='success'?'rgba(16,185,129,0.2)':'rgba(99,102,241,0.2)'}`, display:'flex', gap:16 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background: ins.severity==='warning' ? 'rgba(245,158,11,0.2)' : ins.severity==='success' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Bot size={20} color={ins.severity==='warning'?'#fbbf24':ins.severity==='success'?'#34d399':'#818cf8'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize:14, fontWeight:700, color:'#f1f5f9', marginBottom:6, textTransform:'capitalize' }}>{ins.type.replace('_',' ')} Analysis</h3>
                    <p style={{ fontSize:13, color:'rgba(241,245,249,0.6)', lineHeight:1.6 }}>{ins.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Account Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:28, width:'100%', maxWidth:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', textTransform:'capitalize' }}>Create {showModal}</h2>
              <button onClick={() => setShowModal(null)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(241,245,249,0.5)' }}><X size={18}/></button>
            </div>
            <form onSubmit={e => handleCreateAccount(e, showModal)} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {['full_name', 'username', 'email', 'password'].map(field => (
                <div key={field}>
                  <label style={{ fontSize:12, fontWeight:600, color:'rgba(241,245,249,0.5)', display:'block', marginBottom:6, textTransform:'capitalize' }}>{field.replace('_',' ')}</label>
                  <input type={field==='password'?'password':'text'} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} required style={{ width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f1f5f9', fontSize:13, outline:'none', boxSizing:'border-box' }} />
                </div>
              ))}
              <button type="submit" style={{ width:'100%', padding:'12px', marginTop:8, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, border:'none', cursor:'pointer' }}>Create Account</button>
            </form>
          </motion.div>
        </div>
      )}

      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'14px 20px', borderRadius:14, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:10, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', background: toast.type==='success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border:`1px solid ${toast.type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`, color: toast.type==='success' ? '#6ee7b7' : '#fca5a5' }}>
          {toast.type==='success'?<CheckCircle size={16}/>:<X size={16}/>} {toast.text}
        </div>
      )}
    </DashboardLayout>
  );
}
