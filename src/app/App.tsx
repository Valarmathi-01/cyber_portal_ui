import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ReportCrimePage } from './pages/ReportCrimePage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CitizenComplaintDetails } from './pages/CitizenComplaintDetails';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { PoliceDashboard } from './pages/PoliceDashboard';
import { SuspectIdentifierSearch } from './pages/SuspectIdentifierSearch';
import { ReportSuspect } from './pages/ReportSuspect';
import { CyberVolunteerPage } from './pages/CyberVolunteerPage';
import { CyberVolunteerRegistrationPage } from './pages/CyberVolunteerRegistrationPage';
import { ContactUsPage } from './pages/ContactUsPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminVolunteerRegistrations from './pages/admin/AdminVolunteerRegistrations';
import AdminSuspects from './pages/admin/AdminSuspects';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import { Toaster } from 'sonner';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/report" element={<ReportCrimePage />} />
          <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/complaint/:id" element={<CitizenComplaintDetails />} />
          <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
          <Route path="/dashboard/official" element={<PoliceDashboard />} />

          {/* Fallback for tracking/other links */}
          <Route path="/track" element={<LoginPage />} /> 
        </Route>

        {/* Admin/Official Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        {/* 404 Fallback - Redirect to Landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <Toaster position="top-center" duration={1000} visibleToasts={1} />
    </Router>
  );
}