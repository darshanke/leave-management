import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminAPI from "../api/admin";

export const fetchEmployees = createAsyncThunk("admin/fetchEmployees", async () => {
  const res = await adminAPI.getEmployees();
  return res.data;
});

export const fetchPendingLeaves = createAsyncThunk("admin/fetchPendingLeaves", async () => {
  const res = await adminAPI.getPendingLeaves();
  return res.data;
});

export const decideLeave = createAsyncThunk("admin/decideLeave", async ({ leaveId, payload }) => {
  const res = await adminAPI.decideLeave(leaveId, payload);
  return res.data;
});

export const updateLeaveBalance = createAsyncThunk("admin/updateLeaveBalance", async ({ id, data }) => {
  const res = await adminAPI.updateLeaveBalance(id, data);
  return res.data;
});

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    employees: [],
    pending: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload.employees ?? action.payload;
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.pending = action.payload.pendingLeaves ?? action.payload;
      })
      .addCase(decideLeave.fulfilled, (state, action) => {
        // remove from pending if present
        const id = action.payload?.leave?.id ?? action.payload?.id;
        if (id) state.pending = state.pending.filter((p) => p._id !== id && p.id !== id);
      })
      .addCase(updateLeaveBalance.fulfilled, (state, action) => {
        // update local employee list
        const updated = action.payload.user ?? action.payload;
        state.employees = state.employees.map((e) => (e._id === updated._id ? updated : e));
      });
  },
});

export default leaveSlice.reducer;
