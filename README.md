# BNCC.IN — URL Shortener & QR Code Generator

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./frontend/public/logo-bnccin2-white.svg">
    <source media="(prefers-color-scheme: light)" srcset="./frontend/public/logo-bnccin2.svg">
    <img src="./frontend/public/logo-bnccin.svg" alt="BNCC.IN Logo" width="200"/>
  </picture>
</p>

## 👀 Interface Preview

<table>
  <tr>
    <td align="center">
      <img src="./frontend/public/images/readme_image1.png" alt="Authentication Page" width="100%"/>
      <br />
      <b>Authentication Page</b>
    </td>
    <td align="center">
      <img src="./frontend/public/images/readme_image2.png" alt="Shorten Link / Generate QR Page" width="100%"/>
      <br />
      <b>Shorten Link / Generate QR Page</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./frontend/public/images/readme_image3.png" alt="Result Page" width="100%"/>
      <br />
      <b>Result Page</b>
    </td>
    <td align="center">
      <img src="./frontend/public/images/readme_image4.png" alt="Main Dashboard" width="100%"/>
      <br />
      <b>Main Dashboard</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="./frontend/public/images/readme_image5.png" alt="Edit Dashboard" width="100%"/>
      <br />
      <b>Edit Dashboard</b>
    </td>
    <td align="center">
      <img src="./frontend/public/images/readme_image6.png" alt="Analytics Dashboard" width="100%"/>
      <br />
      <b>Analytics Dashboard</b>
    </td>
  </tr>
</table>

***

## 📖 About BNCC.IN

BNCC.IN is a powerful platform designed to shorten URLs and create dynamic, customizable QR Codes. It features a complete user authentication system (supporting manual registration, Google, and GitHub login) and an intuitive dashboard.

The core of the application lies in its deep analytics, which allows users to track comprehensive statistics for their shortened links, including total clicks, referrer sources, and geographical data.

### Tech Stack

| Component | Primary Technology |
| :--- | :--- |
| **Backend (API)** | Node.js (Express) & TypeScript |
| **Frontend (Web)** | Next.js & React |
| **Database** | MongoDB (Mongoose) |

## ⚙️ Installation Guide

### Prerequisites

Ensure you have **Node.js**, **npm**, and a running **MongoDB** instance (local or Atlas) installed.

### 1️⃣ Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd bncc.in
```

### 2️⃣ Install Dependencies

Dependencies must be installed for both the backend and frontend directories.
```bash
# Backend Dependencies
cd backend
npm install
```
```bash
# Frontend Dependencies
cd ../frontend
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in both the `backend/` and `frontend/` directories and configure your database URI, JWT secret, and any OAuth credentials (Google/GitHub).

### 4️⃣ Start Development Servers

BNCC.IN uses separate servers for the API and the web application. Open two terminal windows and run the following commands:

**Terminal 1 - Start Backend API Server**
```bash
cd backend
npm run build
npm start
```

The API runs on a separate port (e.g., http://localhost:5000)

**Terminal 2 - Start Frontend Web Server**
```bash
cd frontend
npm run dev
```

The application runs at http://localhost:3000

🎉 **Your application is now running.**

## 📁 Project Structure
```
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
```

## 📄 License

This project is licensed under the MIT License.

Made with ❤️ for better link management.