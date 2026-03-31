const User = require('./User');
const Ticket = require('./Ticket');
const Message = require('./Message');

// Ticket <-> Message
Ticket.hasMany(Message, { foreignKey: 'ticket_id', onDelete: 'CASCADE' });
Message.belongsTo(Ticket, { foreignKey: 'ticket_id' });

// Ticket <-> User (Assigned Agent)
User.hasMany(Ticket, { foreignKey: 'assigned_agent_id' });
Ticket.belongsTo(User, { as: 'assigned_agent', foreignKey: 'assigned_agent_id' });

module.exports = { User, Ticket, Message };
