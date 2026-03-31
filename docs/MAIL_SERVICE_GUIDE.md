# 📧 Support-Desk Mail Service Setup Guide

To enable professional email-to-ticket conversion and automated replies, follow these steps to configure your mail service.

## 1. Prerequisites (Gmail Example)

If you are using Gmail, you **cannot** use your regular account password due to security restrictions. You must use an **App Password**.

### Steps to Generate a Gmail App Password:
1. Go to your [Google Account Settings](https://myaccount.google.com/).
2. Navigate to **Security**.
3. Ensure **2-Step Verification** is turned ON.
4. Search for **"App Passwords"** or [click here](https://myaccount.google.com/apppasswords).
5. Name the app "SupportDesk" and click **Create**.
6. **Copy the 16-character code.** This is your `EMAIL_PASSWORD`.

## 2. Configure .env File

Open `backend/.env` and update the following settings:

```env
# Email Configuration (IMAP/SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

## 3. Verify Connection

Use the built-in test utility to verify your credentials before starting the server:

```powershell
cd backend
node test-mail.js
```

### Expected Output:
- ✅ **IMAP Connection Successful!**
- ✅ **SMTP Connection Successful!**

## 4. Troubleshooting

### `AUTHENTICATIONFAILED`
- Double-check your email and App Password.
- Ensure IMAP is enabled in your Gmail settings (Gmail > Settings > Forwarding and POP/IMAP > Enable IMAP).

### `self-signed certificate`
- The system is already configured to allow self-signed certificates for development purposes (`rejectUnauthorized: false`). This is common for local development or when using certain proxies.

### Gmail Security Blocks
- Sometimes Google may block a new "sign-in" from an unfamiliar location. Check your email for a notification and "Confirm it was you."
