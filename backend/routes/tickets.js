const express = require('express');
const { getTickets, getTicketDetail, replyToTicket, updateTicket, getTicketStats, createTicket } = require('../controllers/ticketController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getTickets);
router.get('/stats', auth, getTicketStats);
router.post('/', auth, createTicket);
router.get('/:id', auth, getTicketDetail);
router.post('/:id/reply', auth, replyToTicket);
router.put('/:id', auth, updateTicket);

module.exports = router;
