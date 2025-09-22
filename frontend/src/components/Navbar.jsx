import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export default function Navbar() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link to="/" className="text-primary font-bold">LeaveMgmt</Link>
        </div>
        <div className="space-x-4">
          {!auth.token ? (
            <>
              <Link to="/login" className="text-gray-700">Login</Link>
              <Link to="/register" className="text-gray-700">Register</Link>
            </>
          ) : (
            <>
              {auth.user?.role === "admin" || auth.user?.role === "hr" ? (
                <Link to="/admin" className="text-gray-700">Admin</Link>
              ) : (
                <Link to="/employee" className="text-gray-700">Employee</Link>
              )}
              <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
