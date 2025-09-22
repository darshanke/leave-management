import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../features/employeeSlice";

export default function LeaveHistory() {
  const dispatch = useDispatch();
  const history = useSelector((s) => s.employee.history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="bg-white p-4 rounded shadow max-w-3xl">
      <h3 className="font-semibold mb-3">Leave History</h3>
      {history.length === 0 ? (
        <p className="text-gray-500">No leaves yet</p>
      ) : (
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h._id || h.id} className="border rounded p-2 flex justify-between">
              <div>
                <div className="font-medium">{h.type ?? h.leaveType} ({h.reasonType})</div>
                <div className="text-sm text-gray-600">{new Date(h.startDate).toLocaleDateString()} - {new Date(h.endDate).toLocaleDateString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{(h.status ?? h.status) || "Pending"}</div>
                <div className="text-sm text-gray-500">{h.comments ?? ""}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
