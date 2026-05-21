import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, Wallet, Plus, X, Send, Bot, CheckCircle, Clock, Truck, Shirt } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, createOrder, getMyPayments, createPayment, chatWithAI } from '../services/api';

const ITEMS = ['T-Shirt','Shirt','Pants','Jeans','Jacket','Dress','Shorts','Underwear','Socks','Hoodie','Sweater','Bedsheet'];
const STATUS_COLORS = { submitted:'#818cf8',assigned:'#fbbf24',washing:'#22d3ee',drying:'#fb923c',ready:'#34d399',out_for_delivery:'#a78bfa',delivered:'#6ee7b7' };
const STATUS_LABELS = { submitted:'Submitted',assigned:'Assigned',washing:'Washing',drying:'Drying',ready:'Ready',out_for_delivery:'Out for Delivery',delivered:'Delivered' };

const Stat = ({ icon: Icon, label, value, color }) => (
  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'22px 20px', display:'flex', alignItems:'center', gap:16 }}>
    <div style={{ width:46, height:46, borderRadius:14, background:`${color}18`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.5px' }}>{value}</div>
      <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)', fontWeight:500, marginTop:2 }}>{label}</div>
    </div>
  </div>
);

const Badge = ({ status }) => (
  <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, letterSpacing:'0.3px', background:`${STATUS_COLORS[status] || '#818cf8'}18`, color: STATUS_COLORS[status] || '#818cf8', border:`1px solid ${STATUS_COLORS[status] || '#818cf8'}30` }}>
    {STATUS_LABELS[status] || status}
  </span>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [showPay, setShowPay] = useState(null);
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [msgs, setMsgs] = useState([{ from:'ai', text:"Hi! I'm your LaundryFlow assistant. Ask me about your orders, delivery times, or pricing!" }]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef(null);

  const showToast = (text, type='success') => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([getMyOrders(), getMyPayments()]);
      setOrders(o.data.orders || []);
      setPayments(p.data.payments || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs]);

  const addItem = (name) => {
    const ex = cart.find(c => c.name === name);
    if (ex) setCart(cart.map(c => c.name === name ? {...c, quantity: c.quantity+1} : c));
    else setCart([...cart, { name, quantity:1, price:5 }]);
  };
  const removeItem = (name) => setCart(cart.filter(c => c.name !== name));

  const submitOrder = async () => {
    if (!cart.length) return;
    setSubmitting(true);
    try {
      await createOrder({ items: cart, notes });
      setShowOrder(false); setCart([]); setNotes('');
      showToast('Order created successfully!');
      load();
    } catch (e) { showToast(e.response?.data?.message || 'Error creating order', 'error'); }
    setSubmitting(false);
  };

  const submitPay = async (order_id, amount) => {
    try {
      await createPayment({ order_id, amount, payment_method: 'telebirr' });
      setShowPay(null); showToast('Payment submitted!'); load();
    } catch { showToast('Payment error', 'error'); }
  };

  const sendMsg = async () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput('');
    setMsgs(m => [...m, { from:'user', text: msg }]);
    setAiLoading(true);
    try {
      const res = await chatWithAI({ message: msg });
      setMsgs(m => [...m, { from:'ai', text: res.data.reply }]);
    } catch { setMsgs(m => [...m, { from:'ai', text:'Sorry, AI service unavailable.' }]); }
    setAiLoading(false);
  };

  const activeOrders = orders.filter(o => !['delivered','cancelled'].includes(o.status));

  return (
    <DashboardLayout title={`Welcome, ${user?.full_name?.split(' ')[0] || 'Student'} 👋`} activeTab="Dashboard">
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        <Stat icon={Package} label="Total Orders" value={orders.length} color="#6366f1" />
        <Stat icon={Clock} label="Active Orders" value={activeOrders.length} color="#f59e0b" />
        <Stat icon={CheckCircle} label="Delivered" value={orders.filter(o=>o.status==='delivered').length} color="#10b981" />
        <Stat icon={Wallet} label="Wallet Balance" value={`${user?.wallet_balance || 0} ETB`} color="#06b6d4" />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:6, width:'fit-content' }}>
        {['orders','payments','ai'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 20px', borderRadius:10, border:'none', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s', background: tab===t ? 'rgba(99,102,241,0.2)' : 'transparent', color: tab===t ? '#818cf8' : 'rgba(241,245,249,0.45)' }}>
            {t === 'orders' ? '📦 Orders' : t === 'payments' ? '💳 Payments' : '🤖 AI Chat'}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'#f1f5f9' }}>My Laundry Orders</h2>
            <button onClick={() => setShowOrder(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 16px rgba(99,102,241,0.3)', fontFamily:'inherit' }}>
              <Plus size={15} /> New Order
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign:'center', padding:60, color:'rgba(241,245,249,0.3)' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign:'center', padding:60, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20 }}>
              <Shirt size={48} color="rgba(241,245,249,0.15)" style={{ margin:'0 auto 16px', display:'block' }} />
              <p style={{ color:'rgba(241,245,249,0.4)', marginBottom:16 }}>No orders yet. Start your first laundry order!</p>
              <button onClick={() => setShowOrder(true)} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Create Order</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {orders.map(o => (
                <motion.div key={o.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <span style={{ fontWeight:700, color:'#f1f5f9', fontSize:14 }}>{o.tracking_code}</span>
                      <Badge status={o.status} />
                    </div>
                    <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)' }}>{o.item_count} items · {o.total_price} ETB · {new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    {o.status === 'submitted' && (
                      <button onClick={() => setShowPay(o)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid rgba(99,102,241,0.3)', background:'rgba(99,102,241,0.1)', color:'#818cf8', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                        Pay Now
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {tab === 'payments' && (
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:16 }}>Payment History</h2>
          {payments.length === 0 ? (
            <div style={{ textAlign:'center', padding:60, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20 }}>
              <CreditCard size={48} color="rgba(241,245,249,0.15)" style={{ margin:'0 auto 16px', display:'block' }} />
              <p style={{ color:'rgba(241,245,249,0.4)' }}>No payment history yet.</p>
            </div>
          ) : (
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    {['Order','Amount','Method','Status','Date'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'rgba(241,245,249,0.35)', textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'#f1f5f9', fontWeight:600 }}>{p.tracking_code || '—'}</td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'#34d399', fontWeight:700 }}>{p.amount} ETB</td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'rgba(241,245,249,0.5)', textTransform:'capitalize' }}>{p.payment_method}</td>
                      <td style={{ padding:'14px 16px' }}><Badge status={p.status} /></td>
                      <td style={{ padding:'14px 16px', fontSize:12, color:'rgba(241,245,249,0.35)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* AI Tab */}
      {tab === 'ai' && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column', height:480 }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}><Bot size={18} color="#818cf8" /></div>
            <div><div style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>LaundryFlow AI</div><div style={{ fontSize:11, color:'#34d399' }}>● Online</div></div>
          </div>
          <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius: m.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.from==='user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.06)', border: m.from==='ai' ? '1px solid rgba(255,255,255,0.08)' : 'none', fontSize:13, color:'#f1f5f9', lineHeight:1.6 }}>{m.text}</div>
              </div>
            ))}
            {aiLoading && <div style={{ display:'flex', justifyContent:'flex-start' }}><div style={{ padding:'10px 16px', borderRadius:16, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', fontSize:13, color:'rgba(241,245,249,0.4)' }}>Thinking...</div></div>}
          </div>
          <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMsg()} placeholder="Ask about your laundry..." style={{ flex:1, padding:'10px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#f1f5f9', fontSize:13, fontFamily:'inherit', outline:'none' }} />
            <button onClick={sendMsg} style={{ padding:'10px 16px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', cursor:'pointer', display:'flex', alignItems:'center' }}><Send size={15} /></button>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showOrder && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:28, width:'100%', maxWidth:500, maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>New Laundry Order</h2>
              <button onClick={() => { setShowOrder(false); setCart([]); }} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:'rgba(241,245,249,0.5)' }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(241,245,249,0.35)', marginBottom:10, letterSpacing:'0.8px' }}>SELECT ITEMS</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {ITEMS.map(item => (
                  <button key={item} onClick={() => addItem(item)} style={{ padding:'7px 14px', borderRadius:10, border:'1px solid rgba(99,102,241,0.25)', background: cart.find(c=>c.name===item) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', color: cart.find(c=>c.name===item) ? '#818cf8' : 'rgba(241,245,249,0.6)', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>{item}</button>
                ))}
              </div>
            </div>
            {cart.length > 0 && (
              <div style={{ marginBottom:16, background:'rgba(255,255,255,0.03)', borderRadius:14, padding:14, border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(241,245,249,0.35)', marginBottom:10, letterSpacing:'0.8px' }}>YOUR CART</div>
                {cart.map(c => (
                  <div key={c.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span style={{ fontSize:13, color:'#f1f5f9', fontWeight:500 }}>{c.name} × {c.quantity}</span>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'rgba(241,245,249,0.4)' }}>{c.quantity * c.price} ETB</span>
                      <button onClick={() => removeItem(c.name)} style={{ background:'rgba(239,68,68,0.1)', border:'none', borderRadius:6, padding:'3px 7px', color:'#f87171', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:10, marginTop:6, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, fontSize:14, color:'#f1f5f9' }}>Total</span>
                  <span style={{ fontWeight:800, fontSize:14, color:'#34d399' }}>{cart.reduce((s,c) => s+c.quantity*c.price, 0)} ETB</span>
                </div>
              </div>
            )}
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special instructions (optional)..." rows={2}
              style={{ width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#f1f5f9', fontSize:13, fontFamily:'inherit', outline:'none', resize:'none', marginBottom:16, boxSizing:'border-box' }} />
            <button onClick={submitOrder} disabled={!cart.length || submitting} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background: cart.length ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,0.3)', color:'white', fontWeight:700, fontSize:14, cursor: cart.length ? 'pointer' : 'not-allowed', fontFamily:'inherit' }}>
              {submitting ? 'Submitting...' : `Submit Order (${cart.reduce((s,c)=>s+c.quantity,0)} items)`}
            </button>
          </motion.div>
        </div>
      )}

      {/* Pay Modal */}
      {showPay && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:28, width:'100%', maxWidth:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>Pay for Order</h2>
              <button onClick={() => setShowPay(null)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:'rgba(241,245,249,0.5)' }}><X size={18} /></button>
            </div>
            <div style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:14, padding:16, marginBottom:20 }}>
              <div style={{ fontSize:12, color:'rgba(241,245,249,0.4)', marginBottom:6 }}>Order</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#818cf8', marginBottom:4 }}>{showPay.tracking_code}</div>
              <div style={{ fontSize:13, color:'rgba(241,245,249,0.5)' }}>{showPay.item_count} items</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#34d399', marginTop:10 }}>{showPay.total_price} ETB</div>
            </div>
            <p style={{ fontSize:13, color:'rgba(241,245,249,0.4)', marginBottom:20, lineHeight:1.6 }}>Payment will be submitted for admin confirmation. You can pay via Telebirr or CBE.</p>
            <button onClick={() => submitPay(showPay.id, showPay.total_price)} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(16,185,129,0.3)' }}>
              ✓ Confirm Payment
            </button>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, padding:'14px 20px', borderRadius:14, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:10, boxShadow:'0 20px 60px rgba(0,0,0,0.5)', background: toast.type==='success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.type==='success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: toast.type==='success' ? '#6ee7b7' : '#fca5a5' }}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />} {toast.text}
        </div>
      )}
    </DashboardLayout>
  );
}
