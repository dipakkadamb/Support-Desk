import React from 'react';
import { Clock, User as UserIcon, AlertCircle } from 'lucide-react';

const TicketCard = ({ ticket, onClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <span className="badge badge-open">Open</span>;
      case 'Pending': return <span className="badge badge-pending">Pending</span>;
      case 'Closed': return <span className="badge badge-closed">Closed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Urgent': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="ticket-card" onClick={onClick}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>#{ticket.ticket_id}</span>
          {getStatusBadge(ticket.status)}
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{ticket.subject}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserIcon size={14} /> {ticket.customer_email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className={getPriorityColor(ticket.priority)}>
            <AlertCircle size={14} /> {ticket.priority}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {new Date(ticket.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</button>
      </div>
    </div>
  );
};

export default TicketCard;
