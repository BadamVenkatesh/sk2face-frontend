import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCard from "./pages/LoginCard";
import RegistrationForm from "./pages/RegistrationForm";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import PrivateHomePage from "./pages/PrivateHomePage";
import MatchingHistoryCard from "./pages/MatchingHistoryCard";
import MatchServicePage from "./pages/MatchServicePage";
import Canvas from "./pages/Canvas";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/register" element={<RegistrationForm />} />

        {/* Private / Main Pages */}
        <Route path="/home" element={<PrivateHomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match-history" element={<MatchingHistoryCard />} />
        <Route path="/match-service" element={<MatchServicePage />} />
        <Route path="/drag-and-drop" element={<Canvas />} />

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
