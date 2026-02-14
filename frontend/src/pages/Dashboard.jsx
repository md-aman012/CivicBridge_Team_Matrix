import { useEffect, useState } from "react";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await api.get("/issues");
      setIssues(res.data);
    };
    fetchIssues();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">All Issues</h1>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
