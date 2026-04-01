require('dotenv').config();
const sequelize = require('./models/index');
const imaps = require('imap-simple');
const nodemailer = require('nodemailer');

const checkDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DATABASE: Connection Successful');
    return true;
  } catch (err) {
    console.error('❌ DATABASE: Connection Failed', err.message);
    return false;
  }
};

const checkIMAP = async () => {
  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 5000
    }
  };

  try {
    const connection = await imaps.connect(config);
    connection.end();
    console.log('✅ IMAP (Incoming Mail): Connection Successful');
    return true;
  } catch (err) {
    console.error('❌ IMAP (Incoming Mail): Connection Failed');
    if (err.message.includes('AUTHENTICATIONFAILED')) {
      console.log('   👉 Advice: Please ensure you are using a 16-character Google App Password, NOT your regular password.');
    } else {
      console.log(`   👉 Details: ${err.message}`);
    }
    return false;
  }
};

const checkSMTP = async () => {
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

  try {
    await transporter.verify();
    console.log('✅ SMTP (Outgoing Mail): Connection Successful');
    return true;
  } catch (err) {
    console.error('❌ SMTP (Outgoing Mail): Connection Failed');
    console.log(`   👉 Details: ${err.message}`);
    return false;
  }
};

const runDiagnosis = async () => {
  console.log('\n--- SupportFlow System Diagnosis ---\n');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ CONFIG: EMAIL_USER or EMAIL_PASSWORD missing in .env\n');
    process.exit(1);
  }

  const dbOk = await checkDatabase();
  const imapOk = await checkIMAP();
  const smtpOk = await checkSMTP();

  console.log('\n--- Final Verdict ---');
  if (dbOk && imapOk && smtpOk) {
    console.log('💎 All systems GO. Your Support-Desk is fully operational!\n');
  } else {
    console.log('⚠️ Some systems are failing. Please check the "Details" and "Advice" above.\n');
  }
  
  process.exit();
};

runDiagnosis();
