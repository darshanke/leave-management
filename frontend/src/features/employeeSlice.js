import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as empAPI from "../api/employee";

export const fetchBalance = createAsyncThunk("employee/fetchBalance", async () => {
  const res = await empAPI.getLeaveBalance();
  return res.data;
});

export const fetchHistory = createAsyncThunk("employee/fetchHistory", async () => {
  const res = await empAPI.getLeaveHistory();
  return res.data;
});

export const applyLeave = createAsyncThunk("employee/applyLeave", async (payload) => {
  const res = await empAPI.applyLeave(payload);
  return res.data;
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    balance: { casual: 0, privilege: 0 },
    history: [],
    applyStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balances ?? action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload.leaves ?? action.payload;
      })
      .addCase(applyLeave.pending, (state) => {
        state.applyStatus = "loading";
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.applyStatus = "succeeded";
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeeSlice.reducer;
