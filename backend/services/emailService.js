const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const { Ticket, Message } = require('../models/associations');
const sequelize = require('../models/index');

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT || 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000
  }
};

const pollEmails = async () => {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages) {
      const all = message.parts.find(part => part.which === 'TEXT');
      const header = message.parts.find(part => part.which === 'HEADER');
      const mail = await simpleParser(all.body);

      const subject = mail.subject || 'No Subject';
      const fromEmail = mail.from.value[0].address;
      const body = mail.text || mail.html || '';

      // Check for Ticket ID like [TCK-0001]
      const ticketIdMatch = subject.match(/\[TCK-(\d+)\]/);
      
      if (ticketIdMatch) {
        const ticketId = `TCK-${ticketIdMatch[1]}`;
        const ticket = await Ticket.findOne({ where: { ticket_id: ticketId } });

        if (ticket) {
          // Append message to existing ticket
          await Message.create({
            ticket_id: ticket.id,
            body: body,
            sender_type: 'Customer'
          });
          console.log(`Updated Ticket ${ticketId}`);
        } else {
          // Create new if ID not found (fallback)
          await createNewTicket(subject, fromEmail, body);
        }
      } else {
        // Create new ticket
        await createNewTicket(subject, fromEmail, body);
      }
    }

    connection.end();
  } catch (err) {
    console.error('Error polling emails:', err);
  }
};

const createNewTicket = async (subject, email, body) => {
  const transaction = await sequelize.transaction();
  try {
    // Generate simple Ticket ID
    const lastTicket = await Ticket.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    let nextId = 1;
    if (lastTicket && lastTicket.ticket_id) {
      const lastNum = parseInt(lastTicket.ticket_id.split('-')[1]);
      nextId = lastNum + 1;
    }
    const ticketId = `TCK-${nextId.toString().padStart(4, '0')}`;

    const newTicket = await Ticket.create({
      ticket_id: ticketId,
      subject: subject,
      customer_email: email
    }, { transaction });

    await Message.create({
      ticket_id: newTicket.id,
      body: body,
      sender_type: 'Customer'
    }, { transaction });

    await transaction.commit();
    console.log(`Created Ticket ${ticketId}`);
  } catch (err) {
    await transaction.rollback();
    console.log('Error creating ticket from email:', err);
  }
};

const sendReply = async (ticketId, customerEmail, subject, replyText) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Re: [${ticketId}] ${subject}`,
    text: replyText
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reply sent to ${customerEmail} for ticket ${ticketId}`);
  } catch (err) {
    console.error('Error sending reply:', err);
    throw err;
  }
};

module.exports = { pollEmails, sendReply };
