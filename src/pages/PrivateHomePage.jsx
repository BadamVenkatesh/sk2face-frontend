import { BsPersonBoundingBox, BsPencilSquare, BsPersonVcard } from "react-icons/bs";
import { FiShield, FiAlertTriangle, FiClock, FiBarChart2, FiUsers, FiSearch } from "react-icons/fi";
import { MdOutlineBusinessCenter } from "react-icons/md";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

// ─── MOCK DATA (replace with real API data) ───────────────────────────────────

const officer = {
  fullName: "Sarah Jenkins",
  shortName: "S. Jenkins",
  designation: "Senior Forensic Analyst",
  department: "Digital Evidence Division",
  lastLogin: "Oct 25, 2023, 08:45 AM",
};

const stats = [
  {
    icon: <FiBarChart2 size={20} className="text-[#0B1F3A]" />,
    bgColor: "bg-blue-50",
    label: "Total Matches Performed",
    value: "1,248",
  },
  {
    icon: <FiUsers size={20} className="text-emerald-700" />,
    bgColor: "bg-emerald-50",
    label: "Total Cases Handled",
    value: "342",
  },
  {
    icon: <FiClock size={20} className="text-amber-700" />,
    bgColor: "bg-amber-50",
    label: "Recent Activity",
    value: "Match #M-92810",
    sub: "2 hours ago",
  },
];

const quickActions = [
  {
    icon: <BsPersonBoundingBox size={24} className="text-white" />,
    title: "Match a Sketch",
    desc: "Upload a sketch and retrieve similar images from the national database using advanced biometric cross-matching.",
    href: "#",
  },
  {
    icon: <BsPencilSquare size={24} className="text-white" />,
    title: "Create Sketch",
    desc: "Build a composite sketch using intuitive drag-and-drop facial features for suspect identification.",
    href: "#",
  },
  {
    icon: <FiSearch size={24} className="text-white" />,
    title: "View Matching History",
    desc: "Review previously performed matching results, forensic reports, and audit logs of system activity.",
    href: "#",
  },
  {
    icon: <BsPersonVcard size={24} className="text-white" />,
    title: "View Profile",
    desc: "Access and manage your officer profile, security credentials, and system preferences.",
    href: "#",
  },
];

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function WelcomeCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-5">
      {/* Shield icon block */}
      <div className="w-16 h-16 rounded-xl bg-[#eef1f7] flex items-center justify-center flex-shrink-0">
        <FiShield size={30} className="text-[#0B1F3A]" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h1 className="text-2xl font-extrabold text-[#0B1F3A] leading-snug">
          Welcome, Officer {officer.fullName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Secure forensic face recognition system for authorized personnel.
        </p>

        {/* Meta info row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2">
          <span className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
            <FiClock size={13} className="text-gray-400" />
            Last Login: {officer.lastLogin}
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
            <FiShield size={13} className="text-gray-400" />
            {officer.designation}
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
            <MdOutlineBusinessCenter size={14} className="text-gray-400" />
            {officer.department}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {stat.label}
            </p>
            <p className="text-xl font-extrabold text-[#0B1F3A] leading-tight mt-0.5">
              {stat.value}
            </p>
            {stat.sub && (
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions() {
  return (
    <div>
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-4 rounded-full bg-yellow-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
          Quick Actions
        </h2>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <a
            key={action.title}
            href={action.href}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:border-[#0B1F3A] hover:shadow-md transition-all duration-200"
          >
            {/* Icon block */}
            <div className="w-14 h-14 rounded-xl bg-[#0B1F3A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#162d52] transition-colors duration-200">
              {action.icon}
            </div>
            {/* Text */}
            <div>
              <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#162d52]">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {action.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
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
      © 2023 National Forensic Agency · SK2FACE System · Class: Restricted
    </p>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PrivateHomePage() {
  return (
    <Dashboard>
        <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
            <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-8 space-y-5">
                <WelcomeCard />
                <StatsRow />
                <QuickActions />
                <SecurityNotice />
                <InlineFooter />
            </main>
        </div>
    </Dashboard>
  );
}