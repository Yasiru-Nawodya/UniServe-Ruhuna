import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewRequestPage from "./pages/NewRequestPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student routes */}
        <Route path="/student" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="requests" element={<ComingSoon />} />
          <Route path="requests/new" element={<NewRequestPage />} />
          <Route path="notifications" element={<ComingSoon />} />
          <Route path="profile" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;