import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logout } from "./features/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isLoadingUser = useSelector((state) => state.auth.isLoadingUser);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser()).unwrap().catch(() => dispatch(logout()));
    }
  }, [token, user, dispatch]);

  if (token && !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
   
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              user?.role === "admin" || user?.role === "hr" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/employee" replace />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole={["admin", "hr", "manager"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
  );
}

export default App;
