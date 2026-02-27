import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FaUserCircle,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import { loginUser, clearAuthError } from "../store/authSlice";

export default function LoginCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberTerminal: false,
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({
          username: formData.username,
          password: formData.password,
        })
      ).unwrap();

      navigate("/home", { replace: true });
    } catch {
      // Error is already in Redux state
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-16">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10"
          style={{
            boxShadow:
              "0 20px 40px rgba(11,37,68,0.08), inset 0 -1px 0 rgba(11,37,68,0.03)",
          }}
        >
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
              <FaUserCircle className="text-3xl text-gray-400" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-govNavy leading-tight">
              SK2FACE
            </h1>
            <p className="text-sm tracking-widest text-gray-400 mt-2">
              OFFICIAL LOGIN PORTAL
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Official Username / ID
              </label>

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter your government ID"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#f5f7fa]"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Access Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your secure password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#f5f7fa]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="rememberTerminal"
                  checked={formData.rememberTerminal}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-govNavy focus:ring-govNavy"
                />
                <span className="ml-2">Remember terminal</span>
              </label>

              <button
                type="button"
                className="text-sm text-govNavy font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Authorize Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full inline-flex items-center justify-center gap-3
                py-3 rounded-xl text-white font-semibold
                bg-[#0b2544]
                shadow-md
                transition-all duration-300 ease-in-out
                hover:bg-[#133a66]
                hover:shadow-xl
                hover:-translate-y-0.5
                active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
            "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  Authorize Access
                </>
              )}
            </button>
          </form>

          {/* Warning Box */}
          <div className="mt-6 p-4 rounded-lg bg-warnBg">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-600 mt-1" />

              <div>
                <p className="text-xs font-semibold uppercase text-red-700">
                  AUTHORIZED PERSONNEL ONLY
                </p>
                <p className="text-xs mt-1 text-red-600 leading-tight">
                  Unauthorized access or misuse is strictly prohibited and
                  punishable under the Information Technology Act and applicable
                  Indian laws.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-subtleText">
            <span>For Official Use Only | Tier 4 Data Security</span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
