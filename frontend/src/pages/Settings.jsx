import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Mail, Save, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState({ name: 'Agent', email: '', role: 'Support Agent' });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    autoRefresh: true,
    autoRefreshInterval: 30
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const storedSettings = localStorage.getItem('app_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const handleSave = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="main-content animate-fade-in" style={{ padding: '2.5rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Settings & Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your agent profile and application preferences.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Section */}
        <section style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
              <User size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Agent Profile</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full Name</label>
              <input 
                type="text" 
                value={user.name} 
                disabled 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.9375rem' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="text" 
                value={user.email || 'admin@example.com'} 
                disabled 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.9375rem' }} 
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
              <Mail size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Official Mail Setup</h2>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '1rem' }}>SupportFlow Official Channel Settings</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Incoming (IMAP)</p>
                <p>Server: imap.gmail.com</p>
                <p>Port: 993</p>
                <p>Security: SSL/TLS</p>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Outgoing (SMTP)</p>
                <p>Server: smtp.gmail.com</p>
                <p>Port: 465 / 587</p>
                <p>Security: SSL/STARTTLS</p>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
              💡 Please update your <b>.env</b> file with these parameters and your App Password to start receiving official support tickets.
            </p>
          </div>
        </section>

        {/* Notifications Section */}
        <section style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
              <Bell size={20} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Preference Settings</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Email Notifications</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Receive email alerts for new ticket assignments.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications} 
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Desktop Notifications</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Show browser notifications for urgent tickets.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.desktopNotifications} 
                onChange={(e) => setSettings({...settings, desktopNotifications: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Real-time Dashboard</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Automatically refresh ticket list every few seconds.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoRefresh} 
                onChange={(e) => setSettings({...settings, autoRefresh: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            {saved && (
              <span className="animate-fade-in" style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> Preferences saved successfully
              </span>
            )}
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} /> Save Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
