import { Link } from "react-router-dom";
import { BsPersonBoundingBox, BsPencilSquare, BsPersonVcard, BsArrowRight } from "react-icons/bs";
import { FiShield, FiAlertTriangle, FiSearch } from "react-icons/fi";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { LuScanFace, LuSparkles } from "react-icons/lu";

import Dashboard from "../components/Dashboard";

// ─── MOCK DATA (replace with real API data) ───────────────────────────────────

const officer = {
  fullName: "Badam Venkatesh",
  designation: "Senior Forensic Analyst",
  department: "Digital Evidence Division",
};

const quickActions = [
  {
    icon: <BsPersonBoundingBox size={26} className="text-white" />,
    title: "Match a Sketch",
    desc: "Upload a forensic sketch and retrieve similar faces from the national database using AI-powered biometric cross-matching.",
    to: "/match-service",
    gradient: "from-[#0B1F3A] to-[#1a3a5c]",
    accent: "bg-blue-400/20 text-blue-300",
    tag: "AI Matching",
  },
  {
    icon: <BsPencilSquare size={26} className="text-white" />,
    title: "Create Sketch",
    desc: "Build a composite sketch with our intuitive drag-and-drop toolkit featuring comprehensive facial feature elements.",
    to: "/drag-and-drop",
    gradient: "from-[#1a2e45] to-[#0d3b2e]",
    accent: "bg-emerald-400/20 text-emerald-300",
    tag: "Builder",
  },
  {
    icon: <FiSearch size={26} className="text-white" />,
    title: "Match History",
    desc: "Review past matching results, forensic reports, and complete audit logs for accountability and case review.",
    to: "/match-history",
    gradient: "from-[#2a1a3a] to-[#1a2e45]",
    accent: "bg-purple-400/20 text-purple-300",
    tag: "Records",
  },
  {
    icon: <BsPersonVcard size={26} className="text-white" />,
    title: "My Profile",
    desc: "Access and manage your officer profile, view security credentials, and update system preferences.",
    to: "/profile",
    gradient: "from-[#3a2a1a] to-[#2a1a0a]",
    accent: "bg-amber-400/20 text-amber-300",
    tag: "Account",
  },
];

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#13294B] to-[#1a3a5c] rounded-2xl p-7 md:p-9 text-white shadow-xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left content */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <HiOutlineFingerPrint size={32} className="text-yellow-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-[#0B1F3A] rounded-full" />
          </div>

          {/* Text */}
          <div>
            <p className="text-yellow-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
              <LuSparkles size={12} />
              Welcome Back
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Officer {officer.fullName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-2 text-[11px] text-white/60 font-medium">
                <FiShield size={13} className="text-yellow-400/70" />
                {officer.designation}
              </span>
              <span className="flex items-center gap-2 text-[11px] text-white/60 font-medium">
                <MdOutlineBusinessCenter size={14} className="text-yellow-400/70" />
                {officer.department}
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <Link
          to="/match-service"
          className="flex items-center gap-3 px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#0B1F3A] text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-95 shrink-0"
          style={{ textDecoration: "none" }}
        >
          <LuScanFace size={18} />
          Start New Match
          <BsArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function QuickActionsGrid() {
  return (
    <div>
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full bg-yellow-500" />
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          Quick Actions
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="group relative overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            style={{ textDecoration: "none" }}
          >
            <div className="flex items-start gap-4 p-5">
              {/* Icon block with gradient */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                {action.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#162d52] transition-colors">
                    {action.title}
                  </h3>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${action.accent}`}>
                    {action.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2 flex-shrink-0">
                <BsArrowRight size={18} className="text-gray-400" />
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${action.gradient} transition-all duration-500`} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: "System Status", value: "Operational", color: "text-emerald-600", dot: "bg-emerald-400", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Database", value: "Connected", color: "text-blue-600", dot: "bg-blue-400", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Security Level", value: "Clearance A", color: "text-amber-600", dot: "bg-amber-400", bg: "bg-amber-50", border: "border-amber-100" },
      ].map((item) => (
        <div key={item.label} className={`${item.bg} border ${item.border} rounded-xl px-5 py-4 flex items-center gap-3`}>
          <span className={`w-2.5 h-2.5 rounded-full ${item.dot} animate-pulse`} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{item.label}</p>
            <p className={`text-sm font-bold ${item.color} mt-0.5`}>{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SecurityNotice() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
      <FiAlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs font-semibold uppercase tracking-wide text-red-700 leading-relaxed">
        This system is for authorized law enforcement use only. Unauthorized access, misuse, or
        data extraction is strictly prohibited and subject to federal prosecution.
      </p>
    </div>
  );
}

function InlineFooter() {
  return (
    <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest py-4">
      © 2025 National Forensic Agency · SK2FACE System · Class: Restricted
    </p>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PrivateHomePage() {
  return (
    <Dashboard>
      <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
        <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-8 space-y-6">
          <WelcomeBanner />
          <SystemStatus />
          <QuickActionsGrid />
          <SecurityNotice />
          <InlineFooter />
        </main>
      </div>
    </Dashboard>
  );
}