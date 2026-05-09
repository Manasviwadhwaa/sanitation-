# SAFAI / SAAF – Smart Automated Attendance & Facilities Monitor

A premium, full-stack monorepo application for real-time facility monitoring, featuring a cinematic 3D WebGL dashboard and an intelligent AI-driven backend.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- NVIDIA API Key (for AI Insights)

### 2. Installation
Install all dependencies for both client and server:
```bash
npm run install:all
```

### 3. Configuration
Set up your environment variables in `/server/.env`:
```env
PORT=4000
NVIDIA_API_KEY=your_key_here
```

### 4. Development
Run both the 3D Frontend and the Advanced Backend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Health Check**: [http://localhost:4000/](http://localhost:4000/)

### 5. Production
Build and start the unified server:
```bash
npm run build
npm start
```
The server will host the API at `/api` and serve the static frontend at `/`.

## 🏗️ Project Structure
- `/client`: React + Three.js + Tailwind (The "Pulse" Dashboard)
- `/server`: Node.js + Express + SQLite + node-cron (The "Command Center")
- `/server/data`: Persistent SQLite storage

## 🛰️ Tech Stack
- **Frontend**: React 19, Three.js, Framer Motion, Tailwind CSS
- **Backend**: Express, Socket.io, better-sqlite3, node-cron
- **AI**: NVIDIA NIM (Llama 3.1 70b)
