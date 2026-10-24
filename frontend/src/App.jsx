
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
