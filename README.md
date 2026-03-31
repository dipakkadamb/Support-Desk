# 🎫 SupportFlow Professional Ticketing System

A high-performance, professional-grade support desk application built with React and Node.js. Designed for high volumes, real-time analytics, and seamless agent workflows.

## 🚀 Key Services & Features

### 1. Intelligence & Analytics Service
- **Real-time Stats**: Track Total, Open, Pending, and Resolved tickets directly on the dashboard.
- **Advanced Filtering**: Instant search by ID, Subject, or Customer, combined with status-based filtering.
- **Ticket Creation**: Manually log new customer requests with custom priority and initial messages.
- **Visual Overview**: Premium analytics cards with status indicators.

### 2. Communication & Action Service
- **Threaded Conversations**: Agent-customer interaction with a professional messaging UI.
- **Quick Status Actions**: Resolve, Reopen, or Mark tickets as Pending directly from the detail view.
- **Speed-to-Reply**: Optimized message appending and Ctrl+Enter keyboard shortcuts for professional agents.

### 3. Setup & Configuration Service
- **Agent Profile**: Manage your profile and local application preferences.
- **Preference Management**: Toggle real-time refresh and notification states.
- **Mail Integration**: Robust IMAP/SMTP service for automated ticket creation.

## 🛠️ Technical Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Premium Design System).
- **Backend**: Node.js, Express, Sequelize ORM (SQLite).
- **Mail**: imaps, Nodemailer.
- **Auth**: JWT (JSON Web Tokens) for secure agent sessions.

## 📦 Getting Started

### 1. Installation
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory based on `.env.example`. Follow the [Mail Service Guide](./docs/MAIL_SERVICE_GUIDE.md) for email configuration.

### 3. Initialization
```powershell
cd backend
node seed.js  # Initializes the database with admin@example.com / admin123
```

### 4. Running the App
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🔒 Security & Best Practices
- Targeted SSL/TLS certificate bypass for dev-mode email connections.
- Secure JWT-based authentication.
- Component-level error handling and loading states.
