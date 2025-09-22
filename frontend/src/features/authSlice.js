import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "../api/auth";

// Thunks
export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const res = await authAPI.login(formData);
  const token = res.data?.accessToken || res.data?.token;
  const refreshToken = res.data?.refreshToken || null;

  if (token) {
    localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }

  return { user: res.data.user, token };
});

export const registerUser = createAsyncThunk("auth/register", async (formData) => {
  const res = await authAPI.register(formData);
  return res.data;
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  const res = await authAPI.getMe(); // GET /api/users/me
  return res.data.user ?? res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("accessToken") || null,
    status: "idle",
    error: null,
    isLoadingUser: false,
  },
  reducers: {
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Register
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "registered";
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoadingUser = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoadingUser = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isLoadingUser = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
