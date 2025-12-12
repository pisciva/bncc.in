# BNCC.IN - URL Shortener & QR Code Generator

A full-featured web application for shortening URLs and generating customizable QR Codes, complete with a dashboard and deep analytics features.

## Key Features

* **Link and QR Generation:** Shorten long URLs into easy-to-share short links.
* **QR Code Generation:** Create QR Codes for shortened links, with customization options (color, eyes, borders, etc.).
* **Complete Authentication:** Supports manual signup/login and third-party authentication via Google and GitHub.
* **User Dashboard:** An intuitive dashboard to manage all your links and QR Codes.
* **Deep Analytics:** Track visit statistics, including total clicks, referrer sources, geographical location, and devices used.
* **Advanced Settings:** Options to set password protection, expiration dates, and custom URLs for your links.
* **Intelligent Redirect Handling:** Custom redirection logic for protected or expired links and QR Codes.
* **Account Management:** Forgot/reset password features.

## Technology Stack

This project is built as a separate Full-stack application (monorepo), utilizing the following technologies:

### Backend

| Technology | Description |
| :--- | :--- |
| **TypeScript** | Primary language for backend development. |
| **Node.js/Express** | Runtime and web framework for building a fast and scalable API. |
| **MongoDB/Mongoose** | Flexible NoSQL database and ORM for data modeling. |
| **Passport.js** | Authentication middleware supporting local, Google OAuth, and GitHub OAuth strategies. |
| **Bcrypt** | For securely hashing passwords. |

### Frontend

| Technology | Description |
| :--- | :--- |
| **Next.js** | React framework for developing high-performance web applications. |
| **React** | JavaScript library for building user interfaces. |
| **TypeScript** | Primary language for frontend development. |
| **Tailwind CSS** | CSS framework for fast and reactive custom styling. |
| **React Context** | For global authentication state management. |
| **Chart Libraries** | Used for visualizing analytics data (e.g., `AnalyticsCharts.tsx`). |

## Installation Prerequisites

Before starting, ensure you have the following installed:

* **Git**
* **Node.js** (LTS Version recommended)
* **MongoDB** (Local or via a cloud service like MongoDB Atlas)

You will also need to obtain credentials for third-party services:

* Google OAuth Key/Client (if you want to enable Google login)
* GitHub OAuth Key/Client (if you want to enable GitHub login)
* Email service credentials (for the password reset feature)

## Project Structure

The project structure is divided into two main directories: `backend` and `frontend`.

bncc.in/

├── backend/
│   ├── config/              # Configuration for database connection, passport, and OAuth strategies.
│   ├── middleware/          # Express middleware (e.g., authentication).
│   ├── models/              # MongoDB schemas and models (User, Link, Qr, Analytics).
│   ├── routes/              # API route definitions (auth, main).
│   ├── utils/               # Utility functions (password hashing, email sending, analytics tracking).
│   └── index.ts             # Main entry point for the backend server.
└── frontend/
├── app/                 # Next.js application using the App Router.
├── components/          # Reusable UI components (dash, auth, layout, main).
├── context/             # Global context (e.g., AuthContext).
├── hooks/               # Custom React Hooks (dashboard, pagination, etc.).
├── lib/                 # API client for backend communication.
└── public/              # Static assets (logos, icons, fonts, etc.).

## Usage Example

### 1. Cloning the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd bncc.in
2. Environment Configuration
Create a .env file in the backend/ and frontend/ directories and populate the necessary environment variables (e.g., MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, NEXT_PUBLIC_API_BASE_URL).

3. Installing and Running the Backend
Bash

cd backend
npm install
npm run dev # or npm start
The backend server will run on http://localhost:5000 (port may vary).

4. Installing and Running the Frontend
Bash

cd frontend
npm install
npm run dev
The frontend application will run on http://localhost:3000 (or another Next.js default port).

Contributing
We welcome contributions! If you have ideas for new features, bug fixes, or performance improvements, please follow these steps:

Fork this repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes and commit (git commit -m 'feat: Add new feature').

Push to your branch (git push origin feature/your-feature-name).

Open a new Pull Request.

MIT License
This project is licensed under the MIT License.

MIT License

Copyright (c) [YEAR] [COPYRIGHT HOLDER NAME]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
