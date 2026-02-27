import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LoginCard from "./pages/LoginCard";
import RegistrationForm from "./pages/RegistrationForm";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import PrivateHomePage from "./pages/PrivateHomePage";
import MatchingHistoryCard from "./pages/MatchingHistoryCard";
import MatchServicePage from "./pages/MatchServicePage";
import Canvas from "./pages/Canvas";
import ProtectedRoute from "./components/ProtectedRoute";

import { refreshAccessToken } from "./store/authSlice";
import { fetchUserProfile } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, userUuid } = useSelector((state) => state.auth);

  // ── On mount: if a refresh token exists in localStorage, try to silently
  //    refresh the access token so the user stays logged in across page reloads.
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      dispatch(refreshAccessToken());
    }
  }, [dispatch]);

  // ── Whenever the user becomes authenticated and we have their UUID,
  //    automatically fetch their full profile from the User Service.
  useEffect(() => {
    if (isAuthenticated && userUuid) {
      dispatch(fetchUserProfile(userUuid));
    }
  }, [isAuthenticated, userUuid, dispatch]);

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Private / Main Pages */}
        <Route path="/home" element={<ProtectedRoute><PrivateHomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/match-history" element={<ProtectedRoute><MatchingHistoryCard /></ProtectedRoute>} />
        <Route path="/match-service" element={<ProtectedRoute><MatchServicePage /></ProtectedRoute>} />
        <Route path="/drag-and-drop" element={<ProtectedRoute><Canvas /></ProtectedRoute>} />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="p-20 text-center text-2xl font-semibold">
              404 — Page Not Found
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
