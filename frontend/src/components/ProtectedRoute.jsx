// components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("accessToken");
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  // Wait until user is loaded
  if (!user) return null;

  // Check roles
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (requiredRole && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
