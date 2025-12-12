# BNCC.IN — URL Shortener & QR Code Generator

<p align="center">
  <img src="/logo-bnccin.svg" alt="BNCC.IN Logo" width="200"/>
</p>

![Tampilan Halaman Utama](/logo-bnccin.svg)

A full-stack monorepo for modern link management.

***

## 📖 About BNCC.IN

BNCC.IN is a powerful platform designed to shorten URLs and create dynamic, customizable QR Codes. It features a complete user authentication system (supporting manual registration, Google, and GitHub login) and an intuitive dashboard.

The core of the application lies in its deep analytics, which allows users to track comprehensive statistics for their shortened links, including total clicks, referrer sources, and geographical data.

### Tech Stack

| Component | Primary Technology | Database |
| :--- | :--- | :--- |
| **Backend (API)** | Node.js (Express) & TypeScript | MongoDB (Mongoose) |
| **Frontend (Web)** | Next.js & React | N/A |

## ⚙️ Installation Guide

### Prerequisites

Ensure you have **Node.js**, **npm**, and a running **MongoDB** instance (local or Atlas) installed.

### 1️⃣ Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd bncc.in
2️⃣ Install Dependencies
Dependencies must be installed for both the backend and frontend directories.

Bash

# Backend Dependencies
cd backend
npm install

# Frontend Dependencies
cd ../frontend
npm install
3️⃣ Environment Configuration
Create a .env file in both the backend/ and frontend/ directories and configure your database URI, JWT secret, and any OAuth credentials (Google/GitHub).

4️⃣ Start Development Servers
BNCC.IN uses separate servers for the API and the web application. Open two terminal windows and run the following commands:

Terminal 1 - Start Backend API Server

Bash

cd backend
npm run build
npm start
# The API runs on a separate port (e.g., http://localhost:5000)
Terminal 2 - Start Frontend Web Server

Bash

cd frontend
npm run dev
# The application runs at http://localhost:3000
🎉 Your application is now running.

📁 Project Structure
bncc.in/
├── backend/
│   ├── config/              # DB connection, passport, and OAuth strategies.
│   ├── middleware/          # Express middleware (e.g., authentication).
│   ├── models/              # MongoDB schemas (User, Link, Qr, Analytics).
│   ├── routes/              # API route definitions.
│   ├── utils/               # Utility functions (hashing, email, analytics).
│   └── index.ts             # Main entry point for the backend server.
└── frontend/
    ├── app/                 # Next.js App Router structure.
    ├── components/          # Reusable UI components.
    ├── context/             # Global context (e.g., AuthContext).
    ├── hooks/               # Custom React Hooks.
    ├── lib/                 # API client for backend communication.
    └── public/              # Static assets (logos, icons, fonts).
📄 License
This project is licensed under the MIT License.

Made with ❤️ for better link management.