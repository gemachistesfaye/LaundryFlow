import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shirt, LayoutDashboard, Package, CreditCard, Truck,
  Users, BarChart3, Settings, LogOut, Bell, Menu, X,
  ChevronRight, Wrench, Bot
} from 'lucide-react';
import { getMyNotifications, markNotificationsRead } from '../services/api';

const NAV_CONFIG = {
  student: [
    { icon: Package, label: 'My Orders', path: '/student/dashboard?tab=orders' },
    { icon: CreditCard, label: 'Payments', path: '/student/dashboard?tab=payments' },
    { icon: Bot, label: 'AI Assistant', path: '/student/dashboard?tab=ai' },
  ],
  worker: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/worker/dashboard?tab=overview' },
    { icon: Wrench, label: 'My Queue', path: '/worker/dashboard?tab=queue' },
    { icon: BarChart3, label: 'Performance', path: '/worker/dashboard?tab=performance' },
    { icon: Settings, label: 'Settings', path: '/worker/dashboard?tab=settings' },
  ],
  deliverer: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/deliverer/dashboard?tab=overview' },
    { icon: Truck, label: 'Deliveries', path: '/deliverer/dashboard?tab=deliveries' },
    { icon: BarChart3, label: 'Performance', path: '/deliverer/dashboard?tab=performance' },
    { icon: Settings, label: 'Settings', path: '/deliverer/dashboard?tab=settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard?tab=overview' },
    { icon: Package, label: 'All Orders', path: '/admin/dashboard?tab=orders' },
    { icon: Users, label: 'Users', path: '/admin/dashboard?tab=users' },
    { icon: CreditCard, label: 'Payments', path: '/admin/dashboard?tab=payments' },
    { icon: Bot, label: 'AI Insights', path: '/admin/dashboard?tab=ai' },
  ],
};

const ROLE_COLORS = {
  student: { color: '#818cf8', bg: 'rgba(99,102,241,0.15)', label: 'Student' },
  worker:  { color: '#34d399', bg: 'rgba(16,185,129,0.15)', label: 'Worker' },
  deliverer: { color: '#fb923c', bg: 'rgba(249,115,22,0.15)', label: 'Deliverer' },
  admin:   { color: '#f472b6', bg: 'rgba(244,114,182,0.15)', label: 'Admin' },
};

export default function DashboardLayout({ children, title, activeTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    if (user) {
      getMyNotifications().then(res => setNotifications(res.data.notifications || [])).catch(()=>{});
    }
  }, [user]);

  const handleOpenNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.is_read)) {
      await markNotificationsRead();
      setNotifications(notifications.map(n => ({...n, is_read: true})));
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const role = user?.role || 'student';
  const navLinks = NAV_CONFIG[role] || [];
  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.student;

  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 12px' }}>
      {/* Logo */}
      <div style={{ padding: '20px 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shirt size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9', letterSpacing: '-0.3px' }}>LaundryFlow</div>
            <div style={{ fontSize: 10, color: 'rgba(241,245,249,0.35)', fontWeight: 500 }}>MANAGEMENT SYSTEM</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(241,245,249,0.25)', letterSpacing: '1.5px', padding: '0 8px', marginBottom: 8 }}>NAVIGATION</div>
        {navLinks.map((link, i) => {
          const isActive = activeTab === link.label;
          return (
            <button key={i} onClick={() => { navigate(link.path); setSidebarOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent', background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent', color: isActive ? '#818cf8' : 'rgba(241,245,249,0.5)', fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(241,245,249,0.8)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(241,245,249,0.5)'; } }}>
              <link.icon size={16} />
              {link.label}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: roleStyle.bg, border: `1px solid ${roleStyle.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, color: roleStyle.color }}>
            {(user?.full_name || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name || user?.username}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: roleStyle.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{roleStyle.label}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(239,68,68,0.7)', fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%', transition: 'all 0.2s', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)'; }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f', fontFamily: 'Inter,sans-serif', color: '#f1f5f9' }}>

      {/* Desktop Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: 'rgba(10,10,15,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, background: '#0f0f18', borderRight: '1px solid rgba(255,255,255,0.07)', zIndex: 201, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: 'rgba(241,245,249,0.5)' }}>
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: '7px', cursor: 'pointer', color: 'rgba(241,245,249,0.6)', display: 'none' }}>
              <Menu size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px', lineHeight: 1 }}>{title || 'Dashboard'}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={handleOpenNotifications} style={{ background:'rgba(255,255,255,0.05)', border:'none', borderRadius:10, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(241,245,249,0.7)', transition:'all 0.2s' }}>
                <Bell size={18} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:'#ef4444' }}></span>
                )}
              </button>
              {showNotifications && (
                <div style={{ position:'absolute', top:46, right:0, width:320, background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, boxShadow:'0 10px 40px rgba(0,0,0,0.5)', zIndex:100, overflow:'hidden', display:'flex', flexDirection:'column', maxHeight:400 }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13, fontWeight:700, color:'#f1f5f9' }}>Notifications</div>
                  <div style={{ overflowY:'auto', flex:1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding:24, textAlign:'center', fontSize:13, color:'rgba(241,245,249,0.4)' }}>No notifications yet</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.02)', opacity: n.is_read ? 0.6 : 1, background: n.is_read ? 'transparent' : 'rgba(99,102,241,0.05)' }}>
                          <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', marginBottom:4 }}>{n.title}</div>
                          <div style={{ fontSize:12, color:'rgba(241,245,249,0.5)', lineHeight:1.4 }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 999, background: roleStyle.bg, border: `1px solid ${roleStyle.color}30`, fontSize: 11, fontWeight: 700, color: roleStyle.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {roleStyle.label}
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: roleStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: roleStyle.color }}>
              {(user?.full_name || user?.username || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }} className="page-enter">
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
