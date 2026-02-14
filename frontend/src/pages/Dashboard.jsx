import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await api.get("/issues");
      setIssues(res.data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filter issues based on user role (backend returns user.id, createdBy is populated as { _id, name, role })
  const filteredIssues = issues.filter((issue) => {
    if (user?.role === "RESIDENT") {
      const creatorId = issue.createdBy?._id ?? issue.createdBy;
      const userId = user.id ?? user._id;
      return creatorId != null && userId != null && String(creatorId) === String(userId);
    }
    // Officials see all issues, optionally filtered by status
    if (filter === "ALL") return true;
    return issue.status === filter;
  });

  const statusOptions = [
    "ALL",
    "SUBMITTED",
    "ACKNOWLEDGED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {user?.role === "RESIDENT" ? "My Issues" : "Manage Issues"}
            </h1>
            <p className="text-slate-600 mt-1">
              {user?.role === "RESIDENT"
                ? "Track the status of issues you've reported"
                : "Update the status of issues raised by residents"}
            </p>
          </div>

          {user?.role === "RESIDENT" && (
            <Link
              to="/create-issue"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
            >
              + Report New Issue
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {filteredIssues.length}
            </div>
            <div className="text-sm text-slate-600">
              {user?.role === "RESIDENT" ? "My Issues" : "Total Issues"}
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 shadow-sm border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">
              {filteredIssues.filter((i) => i.status === "SUBMITTED").length}
            </div>
            <div className="text-sm text-amber-600">Submitted</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {filteredIssues.filter((i) => i.status === "IN_PROGRESS").length}
            </div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {filteredIssues.filter((i) => i.status === "RESOLVED").length}
            </div>
            <div className="text-sm text-green-600">Resolved</div>
          </div>
        </div>

        {/* Filter Section - Only for Officials */}
        {user?.role === "OFFICIAL" && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading issues...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No issues found
            </h3>
            <p className="text-slate-600">
              {user?.role === "RESIDENT"
                ? "You haven't reported any issues yet."
                : "No issues match the current filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} onUpdate={fetchIssues} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
