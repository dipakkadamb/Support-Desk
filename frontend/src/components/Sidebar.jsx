import React from 'react';
import { LayoutDashboard, Ticket, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="logo">SupportFlow</div>
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.icon}
              {item.label}
            </div>
          </div>
        ))}
      </nav>
      <div className="nav-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogOut size={20} />
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
