import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const uploadImageMatch = createAsyncThunk(
  "match/uploadImageMatch",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axiosInstance.post("/api/match", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Match request failed"
      );
    }
  }
);

export const fetchMatchHistory = createAsyncThunk(
  "match/fetchMatchHistory",
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/match/history?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch match history"
      );
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  matches: null,   // Latest match result { match1, match2, match3 }
  history: null,   // Paginated history response
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearMatchError(state) {
      state.error = null;
    },
    clearMatches(state) {
      state.matches = null;
    },
  },
  extraReducers: (builder) => {
    // ── Upload Image Match ──
    builder
      .addCase(uploadImageMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.matches = null;
      })
      .addCase(uploadImageMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(uploadImageMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Fetch Match History ──
    builder
      .addCase(fetchMatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchMatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMatchError, clearMatches } = matchSlice.actions;
export default matchSlice.reducer;
