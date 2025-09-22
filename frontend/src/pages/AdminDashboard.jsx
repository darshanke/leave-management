import { useDispatch } from "react-redux";
import EmployeeTable from "../components/EmployeeCard";
import PendingList from "../components/PendingList";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    nav("/login");
  };
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 max-w-8xl mx-auto">
      <nav className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-900 drop-shadow-md">
            Admin Dashboard
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition"
          >
            Register
          </Link>

       

          <button
            onClick={handleLogout}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 border-b-4 border-indigo-500 inline-block pb-2">
          Employees
        </h2>
        <div className="bg-white rounded-xl shadow-lg border border-indigo-300 p-6">
          <EmployeeTable />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 border-b-4 border-indigo-500 inline-block pb-2">
          Pending Leaves
        </h2>
        <div className="bg-white rounded-xl shadow-lg border border-indigo-300 p-6">
          <PendingList />
        </div>
      </section>
    </div>
  );
}
