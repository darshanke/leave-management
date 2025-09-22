import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingLeaves, decideLeave } from "../features/leaveSlice";

export default function PendingList() {
  const dispatch = useDispatch();
  const pending = useSelector((s) => s.leave.pending || []);
  const status = useSelector((s) => s.leave.statusPending);

  useEffect(() => {
    dispatch(fetchPendingLeaves());
  }, [dispatch]);

  const handleAction = async (id, action) => {
    const comments = prompt("Comments (optional)");
    try {
      await dispatch(decideLeave({ leaveId: id, payload: { status: action === "approve" ? "approve" : "reject", comments } })).unwrap();
      alert(`Leave ${action === "approve" ? "approved" : "rejected"}.`);
      dispatch(fetchPendingLeaves()); // refresh list
    } catch (err) {
      alert("Failed: " + (err.message || err));
    }
  };

  if (status === "loading") {
    return <p className="text-indigo-600 font-semibold text-center py-10">Loading pending leaves...</p>;
  }

  if (!pending.length) {
    return <p className="text-indigo-600 font-semibold text-center py-6">No pending requests</p>;
  }

  return (
    <div className="space-y-4">
    

      {pending.map((p) => (
  <div
    key={p._id || p.id}
    className="bg-indigo-50 rounded-lg p-4 flex justify-between items-center shadow"
  >
    <div>
      <div className="font-semibold text-indigo-900">{p.applicantSnapshot?.name ?? p.employeeName}</div>
      <div className="text-sm text-indigo-700">
        {p.type ?? p.leaveType} ({p.reasonType}) — {p.days} days
      </div>
      <div className="text-sm text-indigo-600">
        {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
      </div>
    </div>

    <div className="flex gap-3 items-center">
      {p.status === "pending" ? (
        <>
          <button
            onClick={() => handleAction(p._id || p.id, "approve")}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-1.5 rounded-md transition font-semibold"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(p._id || p.id, "reject")}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-1.5 rounded-md transition font-semibold"
          >
            Reject
          </button>
        </>
      ) : p.status === "approved" ? (
        <span className="font-semibold bg-green-200 text-green-800 px-4 py-1.5 rounded-md">
          Approved
        </span>
      ) : (
        <span className="font-semibold bg-red-200 text-red-800 px-4 py-1.5 rounded-md">
          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
        </span>
      )}
    </div>
  </div>
))}

    </div>
  );
}
