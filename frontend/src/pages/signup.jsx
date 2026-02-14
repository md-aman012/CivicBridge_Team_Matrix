import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RESIDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", {
        name: username,
        email,
        password,
        role,
      });
      setSuccess("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2a44] via-[#163552] to-[#1b3f5e]">
      <Navbar />
      <div className="flex justify-center items-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur"
        >
          <h2 className="text-2xl font-semibold text-slate-800">Sign Up</h2>
          <p className="mt-1 text-sm text-slate-500 mb-4">Create your CivicBridge account</p>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-700">Username</span>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Password</span>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Role</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={loading}
              >
                <option value="RESIDENT">Resident</option>
                <option value="OFFICIAL">Official</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-center text-sm text-green-600">
              {success}
            </p>
          )}

          <button
            className="mt-5 w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
