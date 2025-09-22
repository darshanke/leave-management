import API from "./axios";

export const getEmployees = () => API.get("/users");
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const updateLeaveBalance = (id, data) =>
  API.patch(`/users/leave-balance`, data);

export const getPendingLeaves = () => API.get("/leaves/pending");
export const decideLeave = (leaveId, data) =>
  API.post(`/leaves/${leaveId}/action`, data);
