import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#1f3c5a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo Placeholder */}
        <div className="flex items-center space-x-3">
          
        {/* Logo image will go here later */}
          
          <Link to={"/"}>
          <span className="text-xl font-bold text-orange-400">
            CivicBridge
          </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">

          <Link to="/" className="hover:text-orange-300 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-orange-300 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-orange-300 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#274b6d] px-6 py-4 space-y-4">
          <Link to="/" className="block">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="block">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block">
                Login
              </Link>
              <Link to="/signup" className="block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
