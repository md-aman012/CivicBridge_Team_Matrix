export default function StatusBadge({ status }) {
  const styles = {
    SUBMITTED: "bg-gray-100 text-gray-700 border-gray-300",
    ACKNOWLEDGED: "bg-amber-100 text-amber-700 border-amber-300",
    ASSIGNED: "bg-blue-100 text-blue-700 border-blue-300",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-300",
    RESOLVED: "bg-green-100 text-green-700 border-green-300",
    VERIFIED: "bg-green-100 text-green-700 border-green-400",
  };

  const labels = {
    SUBMITTED: "Submitted",
    ACKNOWLEDGED: "Acknowledged",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    VERIFIED: "Resolved & Verified",
  };

  const showTick = status === "VERIFIED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      {showTick && (
        <svg
          className="w-3.5 h-3.5 text-green-600 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {labels[status] || status}
    </span>
  );
}
