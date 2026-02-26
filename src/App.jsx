import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Header from "./components/Header"
import LoginCard from "./pages/LoginCard"
import RegistrationForm from "./pages/RegistrationForm"
import HomePage from "./pages/HomePage"
import Profile from "./pages/Profile"
import PrivateHomePage from "./pages/PrivateHomePage"
import MatchingHistoryCard from "./pages/MatchingHistoryCard"
import MatchServicePage from "./pages/MatchServicePage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Navbar/>
      <Footer/> */}
      {/* <Dashboard/> */}
      {/* <Header/> */}
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LoginCard />} />
          <Route path="/register" element={<RegistrationForm />} />

          {/* Private / Main Pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/private-home" element={<PrivateHomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/match-history" element={<MatchingHistoryCard />} />
          <Route path="/match-service" element={<MatchServicePage />} />

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
    </>
  )
}

export default App
