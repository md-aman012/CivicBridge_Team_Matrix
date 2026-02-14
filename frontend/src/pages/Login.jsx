import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate(res.data.user?.role === "OFFICIAL" ? "/dashboard" : "/issue-feed");
    } catch (error) {
      console.log("login failed", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      console.log("Error is :", error);
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
          <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your CivicBridge account.</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-slate-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </label>
          </div>

          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            className="mt-5 w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
