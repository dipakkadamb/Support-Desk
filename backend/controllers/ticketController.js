const { Ticket, Message, User } = require('../models/associations');
const { sendReply } = require('../services/emailService');

const getTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tickets = await Ticket.findAll({
      where,
      include: [{ model: User, as: 'assigned_agent', attributes: ['name', 'email'] }],
      order: [['updatedAt', 'DESC']]
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: err.message });
  }
};

const getTicketDetail = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        { model: Message, order: [['createdAt', 'ASC']] },
        { model: User, as: 'assigned_agent', attributes: ['name', 'email'] }
      ]
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket details', details: err.message });
  }
};

const replyToTicket = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const agentId = req.user.id;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // Save message locally
    const message = await Message.create({
      ticket_id: ticket.id,
      body: body,
      sender_type: 'Agent',
      sender_id: agentId
    });

    // Send email to customer
    await sendReply(ticket.ticket_id, ticket.customer_email, ticket.subject, body);

    res.json({ message: 'Reply sent', data: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reply', details: err.message });
  }
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, priority, assigned_agent_id } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const oldStatus = ticket.status;
    await ticket.update({ status, priority, assigned_agent_id });

    // Service: Resolution Notification (Email client when closed)
    if (status === 'Closed' && oldStatus !== 'Closed') {
      const resolutionText = `Hello,\n\nWe're pleased to inform you that your support ticket [${ticket.ticket_id}] has been resolved and closed.\n\nSubject: ${ticket.subject}\n\nIf you have further questions, feel free to reply to this email to reopen the conversation.\n\nBest regards,\nSupportFlow Team`;
      
      // Fire and forget email notification
      sendReply(ticket.ticket_id, ticket.customer_email, ticket.subject, resolutionText, true).catch(err => {
        console.error('Failed to send resolution email:', err);
      });
    }

    res.json({ message: 'Ticket updated', ticket });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

const getTicketStats = async (req, res) => {
  try {
    const total = await Ticket.count();
    const open = await Ticket.count({ where: { status: 'Open' } });
    const pending = await Ticket.count({ where: { status: 'Pending' } });
    const closed = await Ticket.count({ where: { status: 'Closed' } });

    res.json({ total, open, pending, closed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

const createTicket = async (req, res) => {
  const { customer_email, subject, body, priority } = req.body;
  const agentId = req.user.id;

  try {
    const count = await Ticket.count();
    const ticketId = `TCK-${(count + 1).toString().padStart(4, '0')}`;

    const ticket = await Ticket.create({
      ticket_id: ticketId,
      customer_email,
      subject,
      priority: priority || 'Medium',
      status: 'Open',
      assigned_agent_id: agentId
    });

    await Message.create({
      ticket_id: ticket.id,
      body,
      sender_type: 'Customer', // Initially logged as customer request
    });

    res.status(201).json({ message: 'Ticket created', ticket });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket', details: err.message });
  }
};

module.exports = { getTickets, getTicketDetail, replyToTicket, updateTicket, getTicketStats, createTicket };
