const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const { Ticket, Message, User } = require('../models/associations');
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
          await createNewTicket(subject, fromEmail, body);
        }
      } else {
        await createNewTicket(subject, fromEmail, body);
      }
    }

    connection.end();
  } catch (err) {
    if (err.message.includes('AUTHENTICATIONFAILED')) {
      console.error('❌ EMAIL ERROR: Authentication Failed. (PollEmails)');
      console.log('   👉 Advice: Use a 16-character Google App Password in .env, not your main password.');
    } else {
      console.error('Error polling emails:', err.message);
    }
  }
};

const createNewTicket = async (subject, email, body) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Generate professional Ticket ID
    const lastTicket = await Ticket.findOne({ order: [['createdAt', 'DESC']] });
    let nextId = 1;
    if (lastTicket && lastTicket.ticket_id) {
      const lastNum = parseInt(lastTicket.ticket_id.split('-')[1]);
      nextId = lastNum + 1;
    }
    const ticketId = `TCK-${nextId.toString().padStart(4, '0')}`;

    // 2. Service: Auto-Assignment (Assign to the first Admin found)
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    // 3. Create Ticket
    const newTicket = await Ticket.create({
      ticket_id: ticketId,
      subject: subject,
      customer_email: email,
      assigned_agent_id: admin ? admin.id : null
    }, { transaction });

    // 4. Log initial message
    await Message.create({
      ticket_id: newTicket.id,
      body: body,
      sender_type: 'Customer'
    }, { transaction });

    await transaction.commit();
    console.log(`Created Ticket ${ticketId} [Auto-Assigned to ${admin ? admin.name : 'Unassigned'}]`);

    // 5. Service: Auto-Acknowledgment (Professional Welcome Email)
    const welcomeText = `Hello,\n\nYour support request has been received and logged as [${ticketId}]. Our team will review your ticket and get back to you shortly.\n\nSubject: ${subject}\n\nThank you for choosing SupportFlow.`;
    await sendReply(ticketId, email, subject, welcomeText, true);

  } catch (err) {
    await transaction.rollback();
    console.log('Error creating ticket from email:', err);
  }
};

const sendReply = async (ticketId, customerEmail, subject, replyText, isSystemGen = false) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: `SupportFlow <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: isSystemGen ? `[Received] [${ticketId}] ${subject}` : `Re: [${ticketId}] ${subject}`,
    text: replyText
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${customerEmail} for ticket ${ticketId}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = { pollEmails, sendReply };
