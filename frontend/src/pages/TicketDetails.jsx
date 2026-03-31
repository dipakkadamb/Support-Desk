import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle, RotateCcw } from 'lucide-react';

const TicketDetails = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:4000/api/tickets/${ticketId}/reply`, 
        { body: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Rectified: Manually append the new message to avoid full ticket refetch jitter
      setTicket(prev => ({
        ...prev,
        Messages: [...(prev.Messages || []), response.data.data]
      }));
      setReply('');
    } catch (err) {
      alert('Failed to send reply');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/tickets/${ticketId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSendReply();
    }
  };

  if (loading) return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
      <div className="skeleton" style={{ height: '100px', marginBottom: '2rem', borderRadius: 'var(--radius)' }}></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ height: '80px', width: '60%', borderRadius: 'var(--radius)' }}></div>
        <div className="skeleton" style={{ height: '80px', width: '40%', alignSelf: 'flex-end', borderRadius: 'var(--radius)' }}></div>
        <div className="skeleton" style={{ height: '120px', width: '70%', borderRadius: 'var(--radius)' }}></div>
      </div>
      <div className="skeleton" style={{ height: '150px', marginTop: '2rem', borderRadius: 'var(--radius)' }}></div>
    </div>
  );
  if (error) return <div className="main-content"><p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '4rem' }}>{error}</p></div>;
  if (!ticket) return null;

  return (
    <div className="main-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <button onClick={onBack} className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{ticket.subject}</h2>
            <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ticket #{ticket.ticket_id} • {ticket.customer_email}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {ticket.status !== 'Closed' && (
            <button 
              className="btn" 
              onClick={() => handleUpdateStatus('Closed')}
              disabled={updating}
              style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}
            >
              <CheckCircle size={18} /> Resolve
            </button>
          )}
          {ticket.status !== 'Pending' && (
            <button 
              className="btn" 
              onClick={() => handleUpdateStatus('Pending')}
              disabled={updating}
              style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}
            >
              <Clock size={18} /> Move to Pending
            </button>
          )}
          {ticket.status === 'Closed' && (
            <button 
              className="btn" 
              onClick={() => handleUpdateStatus('Open')}
              disabled={updating}
              style={{ background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border)' }}
            >
              <RotateCcw size={18} /> Reopen Ticket
            </button>
          )}
        </div>
      </header>

      <div className="conversation-thread" style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        {ticket.Messages && ticket.Messages.length > 0 ? ticket.Messages.map((msg) => (
          <div key={msg.id} style={{ 
            marginBottom: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: msg.sender_type === 'Agent' ? 'flex-end' : 'flex-start' 
          }}>
            <div style={{ 
              maxWidth: '70%', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius)', 
              background: msg.sender_type === 'Agent' ? 'var(--accent)' : 'white', 
              color: msg.sender_type === 'Agent' ? 'white' : 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              border: msg.sender_type === 'Agent' ? 'none' : '1px solid var(--border)'
            }}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
              <div style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.7rem', 
                opacity: 0.8, 
                display: 'flex', 
                justifyContent: msg.sender_type === 'Agent' ? 'flex-end' : 'flex-start',
                gap: '8px',
                fontWeight: 600
              }}>
                <span>{msg.sender_type === 'Agent' ? 'YOU' : 'CUSTOMER'}</span>
                <span>•</span>
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>Starting conversation...</p>
          </div>
        )}
      </div>

      <div className="reply-box animate-fade-in" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <textarea 
          placeholder="Type your reply here..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: '100%', border: 'none', padding: '1rem', minHeight: '100px', resize: 'none', borderRadius: 'var(--radius)', outline: 'none', fontSize: '1rem' }}
        ></textarea>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0 0 0', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Press <b>Ctrl + Enter</b> to send</p>
          <button 
            className="btn btn-primary" 
            onClick={handleSendReply}
            disabled={sending || !reply.trim()}
            style={{ minWidth: '160px' }}
          >
            {sending ? 'Sending...' : (
              <>
                <Send size={18} /> Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
