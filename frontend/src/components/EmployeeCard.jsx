import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, updateLeaveBalance } from "../features/leaveSlice";

export default function EmployeeTable() {
  const dispatch = useDispatch();
  const employees = useSelector((s) => s.leave.employees || []);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // rows per page

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAdjust = async (id) => {
    const action = prompt("Action (add/reduce)");
    const days = Number(prompt("Days (number)"));
    const leaveType = prompt("Leave type (casual/privilege)").toLowerCase();
    if (!action || !days || !leaveType) return;
    try {
      await dispatch(updateLeaveBalance({ id, data: { action, days, leaveType } })).unwrap();
      alert("Updated");
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / pageSize) || 1;
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIdx, startIdx + pageSize);

  return (
    <div className="p-4 w-full">
      <div className="w-full overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Casual Leave</th>
              <th className="px-4 py-2">Privilege Leave</th>
            <th className="px-4 py-2">Role </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((e) => (
              <tr
                key={e._id || e.id}
                className="border-b hover:bg-indigo-50 transition"
              >
                <td className="px-4 py-2 font-medium text-indigo-900">{e.name}</td>
                <td className="px-4 py-2 text-indigo-700">{e.email}</td>
                <td className="px-4 py-2">{e.department}</td>
                <td className="px-4 py-2 text-center">{e.leaveBalance?.casual ?? "-"}</td>
                <td className="px-4 py-2 text-center">{e.leaveBalance?.privilege ?? "-"}</td>
                <td className="px-4 py-2 text-center">{e.role ?? "-"}</td>
              </tr>
            ))}
            {paginatedEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-indigo-600"
                >
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
