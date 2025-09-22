import API from "./axios";

export const applyLeave = (payload) => API.post("/leaves", payload);
export const getLeaveHistory = () => API.get("/leaves/me");
export const getLeaveBalance = () => API.get("/users/employee/Leave-balance");
