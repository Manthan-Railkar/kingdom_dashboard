# QUANTUM 26 — Live Kingdom Competition Dashboard

Quantum 26 is a live dashboard designed to track alliances, points, trends, news, and overall progress in a dynamic 10-kingdom competition. Built with a React + Vite frontend and an Express + Mongoose backend, the application features a robust real-time leaderboard and role-based administration system.

## 🚀 Features

### 👑 3-Tier Multi-Role System
- **Public View:** See real-time leaderboards, trends, kingdom overviews, breaking news, team rosters, and a rich media gallery. 
- **Captain (Kingdom Admin) View:** Kingdom Captains can log in to a dedicated portal (`/captain`) to manage their specific kingdom. They can upload custom assets (Emblem, Flag, Map, Designs) and manage their council team members, complete with profile picture uploads and custom roles (e.g., Strategist, MVP, Scout).
- **Super Admin View:** The ultimate control panel. Super Admins can log in via the hidden hotkey (`Ctrl+A`) from the main dashboard. They have full access to:
  - Add/Subtract points from any kingdom.
  - Create and assign Captains to specific kingdoms.
  - Push real-time breaking news.
  - Toggle the public visibility of different dashboard modules (e.g., hide the leaderboard or trends).
  - Manage all uploaded media in the gallery.

### ⚡ Real-Time Updates
Socket.io integration ensures that whenever points change, news breaks, or settings are updated, all connected clients immediately reflect the new state without refreshing the page.

### 🎨 Premium Aesthetics
The application leverages a bespoke "Royal Copper" color palette with smooth glassmorphism effects, dynamic micro-animations, animated ember particles, and carefully selected typography, offering a stunning, premium user experience.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router DOM, Lucide-React (Icons), Vanilla CSS
- **Backend:** Node.js, Express, Socket.io, Multer (File Uploads), JSON Web Tokens (JWT)
- **Database:** MongoDB (Mongoose)

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Installation
Clone the repository and install all dependencies (root, server, and client) with a single command:
```bash
npm run install:all
```

### 2. Environment Variables
Create a `.env` file in the root of the project with the following (or use `.env.example` as a template):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/quantum26
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```
*Note: We recommend using port 5001 for the server to avoid conflicts with macOS Control Center (AirPlay) which defaults to 5000.*

### 3. Running the App (Development)
Start both the React client and the Express backend concurrently:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** `http://localhost:5001`

*(The database will automatically seed with 10 default kingdoms, a default Super Admin, and sample data if it detects an empty database.)*

---

## 🔑 Default Admin Access
Upon automatic seeding, the initial Super Admin account is created:
- **Username:** `admin`
- **Access Key (PIN):** `2626`

Press `Ctrl+A` on the main dashboard to open the Super Admin login modal.

---

## 📂 Project Structure

```text
quantum_dashboard/
├── .env                # Global Environment variables
├── package.json        # Root workspace scripts (npm run dev)
├── client/             # Frontend React + Vite Application
│   ├── src/
│   │   ├── components/ # Reusable UI pieces & Admin panels
│   │   ├── context/    # Global State (AdminContext, SettingsContext, etc)
│   │   ├── pages/      # Top-level Views (Dashboard)
│   │   ├── api.js      # Axios API configuration
│   │   └── main.jsx    # Entry point
│   └── vite.config.js  # Vite server proxies
└── server/             # Backend Express Application
    ├── models/         # Mongoose Schemas (Admin, Kingdom, News, etc)
    ├── routes/         # REST API endpoints
    ├── middleware/     # Auth and validation logic
    ├── seed/           # Auto-seeder for DB
    ├── uploads/        # Local storage for images and media
    └── server.js       # Main server entry & socket init
```

---

## 📜 License
© Quantum 26 | All Rights Reserved.
