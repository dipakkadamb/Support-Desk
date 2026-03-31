require('dotenv').config();
const imaps = require('imap-simple');
const nodemailer = require('nodemailer');

const testConnection = async () => {
    console.log('--- Mail Service Test ---');
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`IMAP Host: ${process.env.IMAP_HOST}:${process.env.IMAP_PORT}`);
    console.log(`SMTP Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
    console.log('-------------------------');

    // Test IMAP
    console.log('\nRetreiving IMAP connection...');
    const imapConfig = {
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
        const connection = await imaps.connect(imapConfig);
        console.log('✅ IMAP Connection Successful!');
        connection.end();
    } catch (err) {
        console.error('❌ IMAP Connection Failed:');
        console.error(err.message);
        if (err.message.includes('AUTHENTICATIONFAILED')) {
            console.log('\nTIP: If using Gmail, ensure you are using an "App Password" and not your regular account password.');
        }
    }

    // Test SMTP
    console.log('\nTesting SMTP connection...');
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

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Successful!');
    } catch (err) {
        console.error('❌ SMTP Connection Failed:');
        console.error(err.message);
    }

    console.log('\n--- Test Complete ---');
};

testConnection();
