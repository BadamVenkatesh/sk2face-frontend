import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://b9ad-2409-40f0-d-d432-7188-a40f-50e1-d295.ngrok-free.app";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const { accessToken, refreshToken, userUuid, accessTokenExpiresAt } =
        response.data.data;

      // Persist tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userUuid", userUuid);
      if (accessTokenExpiresAt) {
        localStorage.setItem("accessTokenExpiresAt", accessTokenExpiresAt);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      }, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });

      const data = response.data.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      if (data.accessTokenExpiresAt) {
        localStorage.setItem("accessTokenExpiresAt", data.accessTokenExpiresAt);
      }

      return data;
    } catch (error) {
      const status = error.response?.status;

      // Only clear tokens if the server explicitly says the refresh token is
      // invalid (401/403). For network errors, timeouts, ngrok issues, etc.,
      // keep the existing tokens — the user's access token might still be valid
      // and the response interceptor will handle 401s on actual API calls.
      if (status === 401 || status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userUuid");
        localStorage.removeItem("accessTokenExpiresAt");
      }

      return rejectWithValue(
        error.response?.data?.message || error.message || "Token refresh failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      // Even if logout API fails, we still want to clear local state
      console.warn("Logout API call failed:", error.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userUuid");
      localStorage.removeItem("accessTokenExpiresAt");
    }
    return null;
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  userUuid: localStorage.getItem("userUuid") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userUuid = action.payload.userUuid;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ── Refresh ──
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false;

        // Only clear Redux auth state if the tokens were removed from localStorage
        // (which happens only on 401/403 server responses, not network errors).
        // This prevents logging the user out on network issues / ngrok timeouts.
        const hasTokens = !!localStorage.getItem("accessToken");
        if (!hasTokens) {
          state.accessToken = null;
          state.refreshToken = null;
          state.userUuid = null;
          state.isAuthenticated = false;
        }
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userUuid = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even on error, clear local state
        state.loading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.userUuid = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
