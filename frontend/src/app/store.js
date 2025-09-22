import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import employeeReducer from "../features/employeeSlice";
import leaveReducer from "../features/leaveSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    leave: leaveReducer,
  },
});

export default store;
