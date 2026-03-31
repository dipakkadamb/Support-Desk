import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';
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

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {selectedTicket ? (
          <TicketDetails ticketId={selectedTicket} onBack={handleBack} />
        ) : activeTab === 'dashboard' ? (
          <Dashboard onTicketSelect={handleTicketSelect} />
        ) : (
          <div className="main-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Content for {activeTab} is coming soon...</p>
              </div>
            </header>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
