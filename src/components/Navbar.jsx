import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { LuScanFace } from "react-icons/lu";
import { FiClock } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const navLinks = [
  { label: "Home",          to: "/home",          icon: <AiOutlineHome size={17} /> },
  { label: "Match Service",  to: "/match-service",  icon: <MdOutlineVerifiedUser size={17} /> },
  { label: "Drag and Drop",  to: "/drag-and-drop",  icon: <LuScanFace size={17} /> },
  { label: "Match History",  to: "/match-history",  icon: <FiClock size={17} /> },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine which link is active based on the current pathname
  const isActive = (to) => location.pathname === to;

  return (
    <nav className="w-full bg-[#1a2235] text-white shadow-lg relative" style={{ minHeight: 56 }}>
      {/* ─── Desktop / Top bar ─── */}
      <div className="flex items-center justify-between px-3 sm:px-5 min-[1120px]:px-6 h-14">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2a3550] border-2 border-yellow-500 flex items-center justify-center overflow-hidden shrink-0">
            <svg viewBox="0 0 40 40" width="36" height="36">
              <circle cx="20" cy="20" r="18" fill="#1a2235" stroke="#c9a227" strokeWidth="2" />
              <text x="50%" y="55%" textAnchor="middle" fill="#c9a227" fontSize="13" fontWeight="bold" fontFamily="serif">ก</text>
            </svg>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-white font-extrabold tracking-widest text-base sm:text-lg truncate" style={{ letterSpacing: "0.18em" }}>
              SK2FACE
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] text-gray-400 uppercase font-medium truncate">
              National Forensic Face Recognition
            </span>
          </div>
        </div>

        {/* Nav Links — hidden below 1120px, shown on 1120px+ */}
        <ul className="hidden min-[1120px]:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-2 px-3 xl:px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    active
                      ? "text-yellow-400 border-yellow-400"
                      : "text-gray-300 border-transparent hover:text-white hover:border-gray-500"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  <span className={active ? "text-yellow-400" : "text-gray-400"}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right section — hidden below 1120px */}
        <div className="hidden min-[1120px]:flex items-center gap-3 xl:gap-4 shrink-0">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest whitespace-nowrap">Authenticated Personnel</span>
            <Link to="/profile" className="text-sm text-gray-200 hover:text-yellow-400 transition-colors font-medium" style={{ textDecoration: "none" }}>
              View Profile
            </Link>
          </div>
          {/* Avatar */}
          <Link to="/profile" className="relative">
            <div className="w-10 h-10 rounded-full bg-[#2a3550] border-2 border-gray-500 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 40 40" width="40" height="40">
                <rect width="40" height="40" fill="#2a3550" />
                <circle cx="20" cy="16" r="7" fill="#4a5568" />
                <ellipse cx="20" cy="36" rx="13" ry="9" fill="#4a5568" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1a2235] rounded-full"></span>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-600 mx-1" />

          {/* Logout */}
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LuLogOut size={20} />
          </Link>
        </div>

        {/* Hamburger button — visible below 1120px */}
        <button
          className="min-[1120px]:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <IoClose size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </div>

      {/* ─── Mobile dropdown menu ─── */}
      {menuOpen && (
        <div className="min-[1120px]:hidden absolute top-14 left-0 right-0 bg-[#1a2235] border-t border-gray-700 shadow-xl z-50">
          <ul className="flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150 border-l-[3px] ${
                      active
                        ? "text-yellow-400 border-yellow-400 bg-[#222d44]"
                        : "text-gray-300 border-transparent hover:text-white hover:bg-[#222d44]"
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <span className={active ? "text-yellow-400" : "text-gray-400"}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile user section */}
          <div className="border-t border-gray-700 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/profile" className="relative" onClick={() => setMenuOpen(false)}>
                <div className="w-9 h-9 rounded-full bg-[#2a3550] border-2 border-gray-500 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 40 40" width="36" height="36">
                    <rect width="40" height="40" fill="#2a3550" />
                    <circle cx="20" cy="16" r="7" fill="#4a5568" />
                    <ellipse cx="20" cy="36" rx="13" ry="9" fill="#4a5568" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#1a2235] rounded-full"></span>
              </Link>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Authenticated Personnel</span>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-gray-200 hover:text-yellow-400 transition-colors font-medium" style={{ textDecoration: "none" }}>
                  View Profile
                </Link>
              </div>
            </div>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Logout"
            >
              <LuLogOut size={20} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}