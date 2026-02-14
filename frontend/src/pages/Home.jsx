import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      {/* 🇮🇳 HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1a2e4b] text-white py-24 px-6">
        {/* Subtle Indian Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 relative z-10">
          <div className="space-y-8">
            <div className="inline-block bg-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Digital India Initiative
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Corruption Se Azaadi. <br/>
              <span className="text-orange-400">Behtar Bharat</span> Ki Neeti.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Tired of your complaints disappearing into a "black hole"? CivicBridge ensures 
              every pothole reported and every street light fixed is tracked transparently. 
              No bribes, no "fees"—just pure accountability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="bg-orange-500 text-center text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
              >
                Abhi Shuru Karein
              </Link>
              <Link to={"/about"}>
              <button className="border border-slate-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
                How it Works
              </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1599071420790-2c78f167909a?auto=format&fit=crop&q=80&w=800" 
              alt="Digital Bridge Illustration"
              className="relative rounded-3xl shadow-2xl border-4 border-white/10"
            />
          </div>
        </div>
      </section>

      {/* ⚠️ WHY WE NEED THIS (The Corruption Problem) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Kyon Zaruri Hai CivicBridge?</h2>
          <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 italic">
            "In many parts of India, reporting a local issue requires multiple visits to government offices and, 
            often, 'hidden costs' to get things moving. CivicBridge removes the middleman."
          </p>
          <div className="grid sm:grid-cols-2 gap-6 pt-8 text-left">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-bold text-red-700">The Black Hole Problem</h4>
              <p className="text-sm">Traditional complaints are filed on paper and often "lost" to protect negligent officials.</p>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-bold text-red-700">Lack of Proof</h4>
              <p className="text-sm">Officials often claim work is "finished" when it isn't. We use photo verification to stop the lies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 KEY FEATURES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              📍
            </div>
            <h3 className="text-2xl font-bold mb-4">Galli Ki Samasya</h3>
            <p className="text-slate-600 leading-relaxed">
              Report infrastructure issues with photos. Your report is timestamped and tracked from 
              <strong> Submitted</strong> to <strong>Verified</strong>. 
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              🤝
            </div>
            <h3 className="text-2xl font-bold mb-4">Logon Ki Awaaz</h3>
            <p className="text-slate-600 leading-relaxed">
              Upvote issues in your area. When 100 neighbors upvote a broken road, 
              the officials <strong>must</strong> prioritize it.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              📢
            </div>
            <h3 className="text-2xl font-bold mb-4">Seedha Samvaad</h3>
            <p className="text-slate-600 leading-relaxed">
              Officials can post updates and surveys. Build a community based on 
              trust and transparency, not corruption.
            </p>
          </div>

        </div>
      </section>

      {/* 🎯 CTA SECTION */}
      <section className="bg-orange-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-black text-white mb-6">
            Bhrashtachaar Mukt Bharat, Shuruat Aapke Galli Se.
          </h2>
          <p className="text-orange-100 text-lg mb-10">
            Join thousands of residents making their voices heard. Be the change you want to see.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#1a2e4b] text-white px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform"
          >
            Join the Movement (Abhi Jodein)
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-slate-400 text-sm">
        © 2026 CivicBridge • Made for a Better India • Web and Coding Club NITP
      </footer>
    </div>
  );
}