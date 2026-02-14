import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [issue, setIssue] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIssue = async () => {
    try {
      const res = await api.get(`/issues/${id}`);
      setIssue(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate("/dashboard");
        return;
      }
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.error(err);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await api.get(`/timeline/${id}`);
      setTimeline(res.data);
    } catch (err) {
      console.error("Failed to fetch timeline", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchIssue();
      await fetchTimeline();
      setLoading(false);
    };
    load();
  }, [id]);

  const refresh = async () => {
    await fetchIssue();
    await fetchTimeline();
  };

  const handleVerifyCheck = async (e) => {
    if (!e.target.checked) return;
    try {
      setActionLoading(true);
      await api.patch(`/issues/${id}/verify`);
      await refresh();
    } catch (err) {
      e.target.checked = false;
      alert(err.response?.data?.message || "Failed to verify");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotSatisfiedCheck = async (e) => {
    if (!e.target.checked) return;
    try {
      setActionLoading(true);
      await api.patch(`/issues/${id}/not-satisfied`);
      await refresh();
    } catch (err) {
      e.target.checked = false;
      alert(err.response?.data?.message || "Failed to reopen issue");
    } finally {
      setActionLoading(false);
    }
  };

  const isCreator =
    user &&
    issue?.createdBy &&
    (String(issue.createdBy._id) === String(user.id) ||
      String(issue.createdBy._id) === String(user._id));
  const canVerify =
    user?.role === "RESIDENT" &&
    isCreator &&
    issue?.status === "RESOLVED";

  if (loading || !issue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f2a44] via-[#163552] to-[#1b3f5e]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const [lng, lat] = issue.location?.coordinates ?? [];
  const hasLocation = lng != null && lat != null && (lng !== 0 || lat !== 0);
  const mapsUrl = hasLocation ? `https://www.google.com/maps?q=${lat},${lng}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2a44] via-[#163552] to-[#1b3f5e]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/95 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-slate-800">{issue.title}</h1>
              <StatusBadge status={issue.status} />
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-slate-500 mb-4">
              <span>Reported by {issue.createdBy?.name || "Unknown"}</span>
              <span>•</span>
              <span>
                {new Date(issue.createdAt).toLocaleString()}
              </span>
              {issue.category && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {issue.category}
                  </span>
                </>
              )}
            </div>

            <p className="text-slate-700 whitespace-pre-wrap mb-4">
              {issue.description}
            </p>

            {issue.address && (
              <p className="text-sm text-slate-600 mb-4">📍 {issue.address}</p>
            )}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 transition shadow-md"
              >
                <span className="text-xl">📍</span>
                View issue location on map
              </a>
            )}

            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Issue"
                className="w-full max-h-96 object-contain rounded-xl border border-slate-200 mb-6"
              />
            )}

            {canVerify && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm font-medium text-slate-800 mb-3">
                  Official has marked this as resolved. As the resident who reported this issue, choose one:
                </p>
                <div className="flex flex-col gap-3">
                  <label className="inline-flex items-center gap-3 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      onChange={handleVerifyCheck}
                      disabled={actionLoading}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span><strong>Verified</strong> — problem is fixed (status becomes Resolved & Verified)</span>
                  </label>
                  <label className="inline-flex items-center gap-3 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      onChange={handleNotSatisfiedCheck}
                      disabled={actionLoading}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span><strong>Not satisfied</strong> — reopen issue (status becomes Submitted, visible to everyone)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 sm:px-8 py-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Status timeline
            </h2>
            {timeline.length === 0 ? (
              <p className="text-slate-500 text-sm">No timeline entries yet.</p>
            ) : (
              <ul className="space-y-0">
                {timeline.map((entry, index) => (
                  <li key={entry._id} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < timeline.length - 1 && (
                      <span
                        className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200"
                        aria-hidden
                      />
                    )}
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">
                        {entry.status.replace("_", " ")}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(entry.createdAt).toLocaleString()} · by{" "}
                        {entry.updatedBy}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
