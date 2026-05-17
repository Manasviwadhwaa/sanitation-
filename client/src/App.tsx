import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layouts
import PublicLayout from './components/Layout/PublicLayout';
import WorkerLayout from './components/Layout/WorkerLayout';
import AuthorityLayout from './components/Layout/AuthorityLayout';

// Public Pages
import PublicHome from './pages/public/PublicHome';
import TrackRequest from './pages/public/TrackRequest';
import ReportIssue from './pages/public/ReportIssue';
import PublicMap from './pages/public/PublicMap';
import QRScanner from './pages/public/QRScanner';
import ServicesDirectory from './pages/public/ServicesDirectory';
import ServiceHubDetail from './pages/public/ServiceHubDetail';

// Worker Pages
import WorkerHome from './pages/worker/WorkerHome';

// Authority Pages
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import CaseManagement from './pages/authority/CaseManagement';

// Common
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 1. PUBLIC INTERFACE */}
        <Route path="/public" element={<PublicLayout />}>
          <Route index element={<PublicHome />} />
          <Route path="track" element={<TrackRequest />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="map" element={<PublicMap />} />
          <Route path="scan" element={<QRScanner />} />
          <Route path="services" element={<ServicesDirectory />} />
          <Route path="service-hub" element={<ServiceHubDetail />} />
        </Route>

        {/* 2. WORKER INTERFACE */}
        <Route 
          path="/worker" 
          element={
            isAuthenticated && user?.role === 'Worker' ? <WorkerLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<WorkerHome />} />
        </Route>

        {/* 3. AUTHORITY INTERFACE */}
        <Route 
          path="/authority" 
          element={
            isAuthenticated && ['SuperAdmin', 'Supervisor', 'WardAuthority'].includes(user?.role || '') 
              ? <AuthorityLayout /> 
              : <Navigate to="/login" />
          }
        >
          <Route index element={<AuthorityDashboard />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
