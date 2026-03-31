import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketCard from '../components/TicketCard';
import { Search, Filter, Plus } from 'lucide-react';

const Dashboard = ({ onTicketSelect }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="main-content">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Ticket Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and respond to customer support tickets</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Ticket
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tickets..."
            className="form-control"
            style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" style={{ background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} /> Filter
          </button>
          <select className="form-control" style={{ padding: '0 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <option>Status: All</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="ticket-list">
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div key={ticket.id} onClick={() => onTicketSelect(ticket.id)} style={{ cursor: 'pointer' }}>
                <TicketCard ticket={ticket} />
              </div>
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
