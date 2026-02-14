import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "./StatusBadge";
import { AuthContext } from "../context/AuthContext";

export default function IssueCard({ issue, onUpdate }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Residents upvote issues
  const handleUpvote = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await api.post(`/issues/${issue._id}/upvote`);
      onUpdate(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Error upvoting");
    } finally {
      setLoading(false);
    }
  };

  // Officials update status
  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await api.patch(`/issues/${issue._id}/status`, { status: newStatus });
      setShowStatusMenu(false);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const issueId = issue._id || issue.id;

  // Resident (creator): verify (RESOLVED -> VERIFIED) when checkbox checked
  const handleVerifyCheck = async (e) => {
    e.stopPropagation();
    if (!e.target.checked || !issueId) return;
    try {
      setLoading(true);
      await api.patch(`/issues/${issueId}/verify`);
      onUpdate();
    } catch (err) {
      e.target.checked = false;
      alert(err.response?.data?.message || "Failed to verify");
    } finally {
      setLoading(false);
    }
  };

  // Resident (creator): not satisfied (RESOLVED -> SUBMITTED) when checkbox checked
  const handleNotSatisfiedCheck = async (e) => {
    e.stopPropagation();
    if (!e.target.checked || !issueId) return;
    try {
      setLoading(true);
      await api.patch(`/issues/${issueId}/not-satisfied`);
      onUpdate();
    } catch (err) {
      e.target.checked = false;
      alert(err.response?.data?.message || "Failed to reopen issue");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = () => navigate(`/issues/${issue._id}`);

  const isCreator =
    user &&
    issue.createdBy &&
    (String(issue.createdBy._id) === String(user.id) ||
      String(issue.createdBy._id) === String(user._id));
  const canVerify =
    user?.role === "RESIDENT" && isCreator && issue.status === "RESOLVED";

  const statusOptions = [
    { value: "SUBMITTED", label: "Submitted", color: "gray" },
    { value: "ACKNOWLEDGED", label: "Acknowledged", color: "yellow" },
    { value: "ASSIGNED", label: "Assigned", color: "blue" },
    { value: "IN_PROGRESS", label: "In Progress", color: "indigo" },
    { value: "RESOLVED", label: "Resolved", color: "green" },
  ];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [lng, lat] = issue.location?.coordinates ?? [];
  const hasLocation = lng != null && lat != null && (lng !== 0 || lat !== 0);
  const mapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetail()}
      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 hover:text-orange-600 transition">
            {issue.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Reported on {formatDate(issue.createdAt)}
            {hasLocation && " • Has location"}
          </p>
        </div>
        <StatusBadge status={issue.status} />
      </div>

      <p className="text-slate-700 mb-4 line-clamp-2">{issue.description}</p>

      {issue.imageUrl && (
        <img
          src={issue.imageUrl}
          alt="Issue"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-4 items-center flex-wrap" onClick={(e) => e.stopPropagation()}>
          {canVerify && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  onChange={handleVerifyCheck}
                  disabled={loading}
                  className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span>Verified (problem fixed)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  onChange={handleNotSatisfiedCheck}
                  disabled={loading}
                  className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Not satisfied (reopen issue)</span>
              </label>
            </div>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-lg">📍</span>
              View location
            </a>
          )}
          {user?.role === "RESIDENT" && (
            <button
              onClick={handleUpvote}
              disabled={loading}
              className="flex items-center gap-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              <span className="text-lg">👍</span>
              <span className="font-medium">{issue.upvoteCount || 0}</span>
            </button>
          )}

          {issue.category && (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
              {issue.category}
            </span>
          )}
        </div>

        {user?.role === "OFFICIAL" && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-50 flex items-center gap-2"
            >
              Update Status
              <span className="text-xs">▼</span>
            </button>

            {showStatusMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusUpdate(option.value)}
                      disabled={issue.status === option.value}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition text-sm ${
                        issue.status === option.value
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                      {issue.status === option.value && (
                        <span className="ml-2 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}