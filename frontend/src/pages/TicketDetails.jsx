import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TicketDetails = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
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

    fetchTicketDetails();
  }, [ticketId]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/tickets/${ticketId}/reply`, 
        { body: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh ticket details to show new message
      const response = await axios.get(`http://localhost:4000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
      setReply('');
    } catch (err) {
      alert('Failed to send reply');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="main-content"><p>Loading ticket details...</p></div>;
  if (error) return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!ticket) return null;

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{ticket.subject}</h2>
            <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ticket #{ticket.ticket_id} • From: {ticket.customer_email}</p>
        </div>
      </header>

      <div className="conversation-thread" style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        {ticket.Messages && ticket.Messages.map((msg) => (
          <div key={msg.id} style={{ 
            marginBottom: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: msg.sender_type === 'Agent' ? 'flex-end' : 'flex-start' 
          }}>
            <div style={{ 
              maxWidth: '70%', 
              padding: '1rem', 
              borderRadius: 'var(--radius)', 
              background: msg.sender_type === 'Agent' ? 'var(--accent)' : '#f1f5f9', 
              color: msg.sender_type === 'Agent' ? 'white' : 'var(--text-main)',
              position: 'relative'
            }}>
              <p style={{ margin: 0 }}>{msg.body}</p>
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.7rem', 
                opacity: 0.8, 
                display: 'flex', 
                justifyContent: msg.sender_type === 'Agent' ? 'flex-end' : 'flex-start',
                gap: '8px'
              }}>
                <span>{msg.sender_type === 'Agent' ? 'You' : 'Customer'}</span>
                <span>•</span>
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="reply-box" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'relative' }}>
        <textarea 
          placeholder="Type your reply here..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          style={{ width: '100%', border: 'none', padding: '1.5rem', minHeight: '120px', resize: 'none', borderRadius: 'var(--radius)', outline: 'none' }}
        ></textarea>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSendReply}
            disabled={sending || !reply.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {sending ? 'Sending...' : (
              <>
                <Send size={18} /> Send Reply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
