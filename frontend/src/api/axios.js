import axios from "axios";

const API = axios.create({
  baseURL: "https://leave-management-6xsz.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
