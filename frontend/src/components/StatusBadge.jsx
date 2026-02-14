export default function StatusBadge({ status }) {
  const colors = {
    SUBMITTED: "bg-gray-400",
    ACKNOWLEDGED: "bg-yellow-400",
    ASSIGNED: "bg-blue-400",
    IN_PROGRESS: "bg-orange-400",
    RESOLVED: "bg-green-500",
    VERIFIED: "bg-purple-500",
  };

  return (
    <span className={`px-2 py-1 text-white rounded ${colors[status]}`}>
      {status}
    </span>
  );
}
