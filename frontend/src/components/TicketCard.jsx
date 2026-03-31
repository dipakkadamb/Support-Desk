import React, { memo } from 'react';
import { Clock, User as UserIcon, AlertCircle, ChevronRight } from 'lucide-react';

const TicketCard = memo(({ ticket, onClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <span className="badge badge-open">Open</span>;
      case 'Pending': return <span className="badge badge-pending">Pending</span>;
      case 'Closed': return <span className="badge badge-closed">Closed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'High': return { color: 'var(--danger)', label: 'High Priority' };
      case 'Urgent': return { color: 'var(--danger)', label: 'Urgent' };
      case 'Medium': return { color: 'var(--warning)', label: 'Medium' };
      case 'Low': return { color: 'var(--success)', label: 'Low' };
      default: return { color: 'var(--text-muted)', label: priority };
    }
  };

  const priorityInfo = getPriorityInfo(ticket.priority);

  return (
    <div className="ticket-card animate-fade-in" onClick={onClick}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.8125rem', padding: '4px 8px', background: '#eef2ff', borderRadius: '6px' }}>#{ticket.ticket_id}</span>
          {getStatusBadge(ticket.status)}
        </div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>{ticket.subject}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserIcon size={14} /> <span style={{ fontWeight: 500 }}>{ticket.customer_email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: priorityInfo.color, fontWeight: 600 }}>
            <AlertCircle size={14} /> {priorityInfo.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Updated {new Date(ticket.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div style={{ paddingLeft: '1.5rem', color: 'var(--border)' }}>
        <ChevronRight size={20} />
      </div>
    </div>
  );
});

export default TicketCard;
