import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute
 * Wraps private pages. If the user is not authenticated,
 * they are redirected to /login.
 *
 * On page refresh, the app dispatches refreshAccessToken() which is async.
 * We check both Redux state AND localStorage to decide access:
 *   - Redux isAuthenticated = true → allow (normal logged-in state)
 *   - Redux loading = true → show spinner (refresh in progress)
 *   - localStorage has tokens → allow (tokens exist, refresh may have failed due to network)
 *   - Nothing → redirect to login
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Check localStorage as a fallback — tokens survive page refresh
  // even if the proactive refresh API call failed (e.g. ngrok timeout)
  const hasAccessToken = !!localStorage.getItem("accessToken");

  // User is authenticated via Redux OR has valid tokens in localStorage
  if (isAuthenticated || hasAccessToken) {
    return children;
  }

  // Refresh is still in progress → show loading spinner
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f0f2f5",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #D0D7E3",
            borderTopColor: "#0B1F3A",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#6B7A99",
            letterSpacing: "0.05em",
          }}
        >
          Restoring session…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No tokens, not loading → redirect to login
  return <Navigate to="/login" replace />;
}
