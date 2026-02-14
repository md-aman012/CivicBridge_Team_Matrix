import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function IssueCard({ issue }) {
  return (
    <div className="border p-4 mb-4 rounded shadow">
      <h2 className="text-lg font-bold">{issue.title}</h2>
      <p>{issue.description}</p>
      <StatusBadge status={issue.status} />
      <p>Upvotes: {issue.upvotes}</p>
      <Link to={`/issue/${issue.id}`} className="text-blue-500">
        View Details
      </Link>
    </div>
  );
}
