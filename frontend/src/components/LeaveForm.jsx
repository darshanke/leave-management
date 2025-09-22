import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyLeave } from "../features/employeeSlice";

export default function LeaveForm({setRefersHistory}) {
  const [form, setForm] = useState({
    leaveType: "Casual",
    reasonType: "Sick",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const dispatch = useDispatch();
  const status = useSelector((s) => s.employee.applyStatus);

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Calculate days correctly
      const s = new Date(form.startDate);
      const eD = new Date(form.endDate);
      const days = Math.round((eD - s) / (24 * 3600 * 1000)) + 1;

      await dispatch(
        applyLeave({
          type: form.leaveType.toLowerCase(), // rename to 'type' and lowercase
          reasonType: form.reasonType.toLowerCase(), // lowercase here too
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason,
          days,
        })
      ).unwrap();

      alert("Leave applied");

      setForm({
        leaveType: "casual",
        reasonType: "sick",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setRefersHistory(prev=>!prev);
    } catch (err) {
      alert("Failed: " + (err?.message || "error"));
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded shadow mb-6 max-w-xl"
    >
      <h3 className="font-semibold mb-3">Apply Leave</h3>
      <div className="grid grid-cols-2 gap-3">
        <select
          className="border p-2"
          value={form.leaveType}
          onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
        >
          <option>Casual</option>
          <option>Privilege</option>
        </select>
        <select
          className="border p-2"
          value={form.reasonType}
          onChange={(e) => setForm({ ...form, reasonType: e.target.value })}
        >
          <option>Sick</option>
          <option>Vacation</option>
        </select>
        <input
          type="date"
          className="border p-2"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>
      <textarea
        className="border p-2 w-full mt-3"
        placeholder="Comments"
        value={form.reason}
        onChange={(e) => setForm({ ...form, reason: e.target.value })}
      />
      <div className="mt-3">
        <button
          disabled={status === "loading"}
          className={`${
            status === "loading"
              ? "bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === "loading" ? "Applying..." : "Apply"}
        </button>
      </div>
    </form>
  );
}
