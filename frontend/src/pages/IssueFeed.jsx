import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function IssueFeed() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvoteLoading, setUpvoteLoading] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await api.get("/issues");
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "OFFICIAL") {
      navigate("/dashboard", { replace: true });
      return;
    }
    fetchIssues();
  }, [user?.role]);

  const handleUpvote = async (issueId) => {
    try {
      setUpvoteLoading(issueId);
      await api.post(`/issues/${issueId}/upvote`);
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.message || "Error upvoting");
    } finally {
      setUpvoteLoading("");
    }
  };

  const hasUpvoted = (issue) => {
    const userId = user?.id ?? user?._id;
    if (!userId || !issue.upvotes?.length) return false;
    return issue.upvotes.some((id) => String(id) === String(userId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2a44] via-[#163552] to-[#1b3f5e]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Issue Feed
        </h1>
        <p className="text-slate-300 text-sm mb-8">
          All reported issues. Upvote ones you care about.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-300">Loading feed...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/95 p-8 sm:p-12 text-center shadow-xl">
            <p className="text-slate-600 mb-4">No issues reported yet.</p>
            <Link
              to="/create-issue"
              className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Report the first issue
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {issues.map((issue) => {
              const upvoted = hasUpvoted(issue);
              const [lng, lat] = issue.location?.coordinates ?? [];
              const hasLocation = lng != null && lat != null && (lng !== 0 || lat !== 0);
              const mapsUrl = hasLocation ? `https://www.google.com/maps?q=${lat},${lng}` : null;
              return (
                <div
                  key={issue._id}
                  className="rounded-2xl border border-white/10 bg-white/95 shadow-xl overflow-hidden"
                >
                  <div className="p-5 sm:p-6 flex flex-col gap-3">
                    {/* User and time */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-lg">
                        {issue.createdBy?.name ? issue.createdBy.name[0] : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {issue.createdBy?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(issue.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {issue.category && (
                        <span className="ml-auto px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          {issue.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-1">
                        {issue.title}
                      </h2>
                      <p className="text-slate-700 text-sm">{issue.description}</p>
                      {issue.address && (
                        <p className="text-xs text-slate-500 mt-1">
                          📍 {issue.address}
                        </p>
                      )}
                      {issue.imageUrl && (
                        <img
                          src={issue.imageUrl}
                          alt="Issue"
                          className="w-full max-h-72 object-cover rounded-xl mt-3 border border-slate-200"
                        />
                      )}
                    </div>

                    {/* Upvote, location and status */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        {mapsUrl && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-orange-600 hover:bg-orange-50 transition"
                          >
                            <span className="text-xl">📍</span>
                            View location
                          </a>
                        )}
                        <button
                          onClick={() => handleUpvote(issue._id)}
                          disabled={upvoteLoading === issue._id || upvoted}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition disabled:opacity-70 disabled:cursor-not-allowed ${
                            upvoted
                              ? "bg-orange-100 text-orange-700 cursor-default"
                              : "text-orange-600 hover:bg-orange-50"
                          }`}
                        >
                          <span className="text-xl">👍</span>
                          <span>{upvoted ? "Upvoted" : "Upvote"}</span>
                          <span className="font-bold">
                            {issue.upvoteCount ?? 0}
                          </span>
                          {upvoteLoading === issue._id && (
                            <span className="text-xs text-slate-400">...</span>
                          )}
                        </button>
                      </div>
                      <span className="px-3 py-1.5 text-xs rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
