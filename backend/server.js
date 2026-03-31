require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
const { User, Ticket, Message } = require('./models/associations');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'SupportFlow Backend Online' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));

const { pollEmails } = require('./services/emailService');

// Sync Database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced successfully');
    
    // Initial poll and set interval (every 5 mins)
    pollEmails();
    setInterval(pollEmails, 5 * 60 * 1000);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
