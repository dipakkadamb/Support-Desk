const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const sequelize = require('./models/index');
const { User, Ticket, Message } = require('./models/associations');

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware (Global Security Shield)
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent overload
app.use(xss()); // Sanitize user input (XSS protection)
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Health check
app.get('/', (req, res) => res.json({ status: 'SupportFlow Backend Online' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/users', require('./routes/users'));

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
