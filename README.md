# SAFAI - Smart Automated Facilities & Attendance Monitor

SAFAI is a high-fidelity, mission-critical municipal operational platform designed to manage and monitor public sanitation infrastructure in real-time.

## 🚀 Deployment Guide

### 1. Push to GitHub
To host this project on Vercel/GitHub, run the following commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Host Frontend on Vercel
1. Go to [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. Set the **Root Directory** to `client`.
4. Add the **Environment Variable**: `VITE_API_URL` (pointing to your deployed backend).
5. Deploy.

### 3. Host Backend on Railway/Render
1. Import your repository.
2. Set the **Root Directory** to `server`.
3. Set the **Build Command**: `npm install && npm run build` (or similar).
4. Set the **Start Command**: `npm start`.
5. Ensure persistent storage is enabled for the `.db` file if using SQLite.

## ✨ Premium Features
- **Neural Command Surface**: Real-time 3D background with interactive data layers.
- **Predictive Analytics**: AI-driven surge forecasting and operational heatmaps.
- **Responsive Mastery**: Perfect performance across mobile, tablet, and desktop.
- **Mission-Critical Typography**: Utilizing Outfit and Inter for a high-end editorial feel.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, React Three Fiber, Tailwind CSS.
- **Backend**: Node.js, Express, Socket.io, SQLite.
- **Intelligence**: Custom simulation engine and tactical data stream.
