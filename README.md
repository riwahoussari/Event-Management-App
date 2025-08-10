# 🎟 Event Management App

A modern full-stack event discovery and management platform built with **React + TypeScript** on the frontend and **Node.js + Express** on the backend.

---

## ✨ Features

### 👥 Regular User
- View all events with **filtering** (by city, date, category) and **sorting**
- Like/unlike events and view liked events in the **Favorites** page
- Register and cancel registration for events
- View organizer profiles

### 🏢 Organizer
- Create and cancel events
- View event registrations and **approve/deny** them
- Mark attendance for participants
- View regular user profiles **only** if the user registered for one of the organizer’s events
- View event stats, such as:
  - Conversion rate
  - Gender distribution of registrations
  - And many more...

### 🛡 Admin
- Suspend users and events
- View event registrations
- View full profiles of both **regular users** and **organizers**, including:
  - Registration and attendance stats
  - Event statistics for organizers
- View platform-wide statistics
- Create categories
- Promote regular users to organizers

---

## 🛠 Tech Stack

**Frontend:**
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/) for fast builds
- [TypeScript](https://www.typescriptlang.org/)
- [ShadCN UI](https://ui.shadcn.com/) + [TailwindCSS](https://tailwindcss.com/)
- Context API for global state management
- Custom `useFetch` hook for API calls

**Backend:**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- SQLite database
- REST API endpoints for authentication, events, and admin tools
- [Swagger](https://swagger.io/) API documentation

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone git clone https://github.com/riwahoussari/Event-Management-App.git
cd Event-Management-App
```
### 2️⃣ Start the Client (port 4173)
```bash
cd client
npm install
npm run build
npm run preview
```
### 3️⃣ Start the Server (port 5000)
```bash
cd server
npm install
node db/init.js
node server.js
```

### 4️⃣ API documentation is available at:
``` bash
http://localhost:5000/api-docs
```


