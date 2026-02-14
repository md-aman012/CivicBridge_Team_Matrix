import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IssueFeed from "./pages/IssueFeed";
import IssueDetail from "./pages/IssueDetail";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import CreateIssue from "./pages/CreateIssue";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/issue-feed" element={<IssueFeed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/create-issue" element={<CreateIssue />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
