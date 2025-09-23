import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom"; // <-- added Link

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();


  //submit handler
  const submit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await dispatch(loginUser(form)).unwrap();
      const role = res.user?.role ?? "employee";
      if (role === "admin" || role === "hr" || role === "manager") nav("/admin");
      else nav("/employee");
    } catch (err) {
      if(err?.status === 401) {
        setError("Invalid email or password.");
      }
      else if(err?.status === 422) {
        setError("Please fill all required fields correctly." , err?.errors?.path);
      }
      else if(err?.status === 500) { 
        setError("Server error. Please try again later.");
      }
      else{
         setError(err?.message || "Login failed");
      }
    }
  };


  // jsx for login form 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Login
        </button>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </form>
      
    </div>
  );
}
