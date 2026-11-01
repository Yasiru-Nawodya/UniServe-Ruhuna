import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import StudentDashboard from "./pages/StudentDashboard";
import MyRequestsPage from "./pages/MyRequestsPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import NewRequestPage from "./pages/NewRequestPage";
import NotificationsPage from "./pages/NotificationsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRequestDetailsPage from "./pages/AdminRequestDetailsPage";

import ServiceStaffDashboard from "./pages/ServiceStaffDashboard";
import ServiceStaffRequestDetailsPage from "./pages/ServiceStaffRequestDetailsPage";

import DashboardLayout from "./components/layout/DashboardLayout";

function ComingSoon() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        Page Under Development
      </h1>

      <p className="mt-3 text-slate-500">
        This feature is coming soon to UniServe-Ruhuna.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Student routes */}
        <Route
          path="/student"
          element={<DashboardLayout />}
        >
          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="requests"
            element={<MyRequestsPage />}
          />

          <Route
            path="requests/:requestId"
            element={<RequestDetailsPage />}
          />

          <Route
            path="requests/new"
            element={<NewRequestPage />}
          />

          <Route
            path="notifications"
            element={<NotificationsPage />}
          />

          <Route
            path="profile"
            element={<ComingSoon />}
          />

          <Route
            path="settings"
            element={<ComingSoon />}
          />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/requests/:requestId"
          element={<AdminRequestDetailsPage />}
        />

        {/* Service Staff routes */}
        <Route
          path="/service-staff/dashboard"
          element={<ServiceStaffDashboard />}
        />

        <Route
          path="/service-staff/requests/:requestId"
          element={<ServiceStaffRequestDetailsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;