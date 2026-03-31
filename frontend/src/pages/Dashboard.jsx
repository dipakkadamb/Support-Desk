import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import NewTicketModal from '../components/NewTicketModal';
import { Search, Filter, Plus, Activity, AlertCircle, Clock, CheckCircle, SearchX } from 'lucide-react';

const Dashboard = ({ onTicketSelect }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, pending: 0, closed: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [ticketsRes, statsRes] = await Promise.all([
        axios.get('http://localhost:4000/api/tickets', { headers }),
        axios.get('http://localhost:4000/api/tickets/stats', { headers })
      ]);
      
      setTickets(ticketsRes.data);
      setFilteredTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, tickets]);

  const statCards = [
    { label: 'Total Tickets', value: stats.total, icon: <Activity size={20} />, color: '#4f46e5' },
    { label: 'Open', value: stats.open, icon: <AlertCircle size={20} />, color: '#ef4444' },
    { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: '#f59e0b' },
    { label: 'Resolved', value: stats.closed, icon: <CheckCircle size={20} />, color: '#10b981' },
  ];

  return (
    <div className="main-content">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Welcome Back, Agent</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Here is what's happening with your support desk today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Ticket
        </button>
      </header>

      {/* New Ticket Modal Service */}
      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchData()} 
      />

      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className="stat-card animate-fade-in" 
            style={{ 
              borderLeft: `4px solid ${card.color}`, 
              animationDelay: `${idx * 0.1}s`,
              cursor: 'pointer' 
            }}
            onClick={() => setStatusFilter(card.label === 'Total Tickets' ? 'All' : (card.label === 'Resolved' ? 'Closed' : card.label))}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-label">{card.label}</p>
                <h2 className="stat-value">{card.value}</h2>
              </div>
              <div style={{ color: card.color, background: `${card.color}15`, padding: '8px', borderRadius: '10px' }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or customer..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2px' }}>
            {['All', 'Open', 'Pending', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: 'none', 
                  background: statusFilter === status ? 'var(--accent)' : 'transparent',
                  color: statusFilter === status ? 'white' : 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="ticket-list" style={{ opacity: 0.5 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '80px', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '1rem' }}></div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      ) : (
        <div className="ticket-list animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div key={ticket.id} onClick={() => onTicketSelect(ticket.id)}>
                <TicketCard ticket={ticket} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }} className="animate-fade-in">
              <SearchX size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>No tickets found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any tickets matching "{searchTerm}". Try adjusting your filters or search terms.
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="btn" 
                style={{ marginTop: '1.5rem', color: 'var(--accent)', fontWeight: 700 }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
