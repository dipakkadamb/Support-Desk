import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleTicketSelect = (id) => {
    setSelectedTicket(id);
  };

  const handleBack = () => {
    setSelectedTicket(null);
  };

  if (loading) return null;

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (selectedTicket) {
      return <TicketDetails ticketId={selectedTicket} onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTicketSelect={handleTicketSelect} />;
      case 'tickets':
        return <Dashboard onTicketSelect={handleTicketSelect} />;
      case 'team':
        return <Employees />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onTicketSelect={handleTicketSelect} />;
    }
  };

  return (
    <div className="app-container" style={{ background: 'var(--bg-main)', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar 
        activeTab={selectedTicket ? 'tickets' : activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedTicket(null);
        }} 
        onLogout={handleLogout} 
      />
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
