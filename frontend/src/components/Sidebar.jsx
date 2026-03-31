import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Ticket, Settings, LogOut, User as UserIcon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [user, setUser] = useState({ name: 'Agent', email: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={20} /> },
    { id: 'team', label: 'Team', icon: <UserIcon size={20} />, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user.role === 'admin');

  return (
    <div className="sidebar" style={{ background: '#0f172a', borderRight: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ padding: '8px', background: 'var(--accent)', borderRadius: '10px', color: 'white' }}>
          <Ticket size={24} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.025em' }}>SupportFlow</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', paddingLeft: '1rem' }}>Principal Menu</p>
        {filteredMenuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '0.875rem 1rem', 
              transition: 'var(--transition)',
              background: activeTab === item.id ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
              color: activeTab === item.id ? 'white' : '#94a3b8',
              borderLeft: activeTab === item.id ? '4px solid var(--accent)' : '4px solid transparent',
              borderRadius: activeTab === item.id ? '0 8px 8px 0' : '0',
              marginBottom: '4px'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.9375rem', fontWeight: activeTab === item.id ? 700 : 500 }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#1e293b', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
            <UserIcon size={20} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.role || 'Support Agent'}</p>
          </div>
        </div>
        <div
          className="nav-item logout-link"
          onClick={onLogout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '0.875rem 1rem', 
            color: '#f87171', 
            background: 'transparent',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
