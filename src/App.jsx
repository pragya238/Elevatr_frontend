import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIRecommendations from "./pages/AIRecommendations";
import Skills from "./pages/Skills";
import ResumePage from "./pages/ResumeSection";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/dashboard" replace />
              : <Home />
          }
        />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* SKILLS PAGE */}
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />

        {/* AI PAGE */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIRecommendations />
            </ProtectedRoute>
          }
        />

        {/* RESUME PAGE  */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      </Routes>
      
      

    </BrowserRouter>
  );
}
