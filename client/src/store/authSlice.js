import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetUser, clearToken } from "../api";

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    try {
      return await apiGetUser();
    } catch (error) {
      clearToken();
      throw error;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "loading",
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = "ready";
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.status = "ready";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "ready";
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.status = "ready";
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
