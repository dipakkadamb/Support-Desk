const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Open', 'Pending', 'Closed'),
    defaultValue: 'Open'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium'
  },
  assigned_agent_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  // Option to auto-generate TCK-XXXX logic could be added here or in the controller
});

module.exports = Ticket;
