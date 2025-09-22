import {  useNavigate } from "react-router-dom";
import LeaveForm from "../components/LeaveForm";
import LeaveHistory from "../components/LeaveHistory";

import { logout } from "../features/authSlice";
import { useDispatch } from "react-redux";

export default function EmployeeDashboard() {
    const dispatch = useDispatch();
  const nav = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        nav("/login");
      };
  return (
    <div className="max-w-[100%] mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <nav className="bg-indigo-100 shadow-md px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center space-x-3">
          {/* Replace with your logo image or SVG */}
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-900 drop-shadow-md">
            Employee Dashboard
          </h1>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </nav>
      <div className="flex flex-col md:flex-row md:space-x-10 space-y-8 md:space-y-0">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg hover:shadow-indigo-400 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4 border-b border-indigo-400 pb-2">
            Apply for Leave
          </h2>
          <LeaveForm />
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg hover:shadow-indigo-400 transition-shadow duration-300 relative">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b border-indigo-300 pb-2">
            Leave History
          </h2>

          {/* Pulse animation to indicate real-time updates */}
          <span
            className="absolute top-4 right-6 w-4 h-4 bg-indigo-500 rounded-full animate-pulse"
            title="Real-time updates"
          />

          <LeaveHistory />
        </div>
      </div>
    </div>
  );
}
