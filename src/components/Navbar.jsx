import { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { LuScanFace } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";

const navLinks = [
  { label: "Home", href: "#", icon: <AiOutlineHome size={17} /> },
  { label: "Match Service", href: "#", icon: <MdOutlineVerifiedUser size={17} />, active: true },
  { label: "Drag and Drop", href: "#", icon: <LuScanFace size={17} /> },
  { label: "Match History", href: "#", icon: <FiClock size={17} /> },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Match Service");

  return (
    <nav className="w-full bg-[#1a2235] text-white flex items-center justify-between px-6 py-0 shadow-lg" style={{ minHeight: 60 }}>
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        {/* Emblem placeholder */}
        <div className="w-10 h-10 rounded-full bg-[#2a3550] border-2 border-yellow-500 flex items-center justify-center overflow-hidden">
          {/* Thai-style emblem SVG placeholder */}
          <svg viewBox="0 0 40 40" width="36" height="36">
            <circle cx="20" cy="20" r="18" fill="#1a2235" stroke="#c9a227" strokeWidth="2" />
            <text x="50%" y="55%" textAnchor="middle" fill="#c9a227" fontSize="13" fontWeight="bold" fontFamily="serif">ก</text>
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-extrabold tracking-widest text-lg" style={{ letterSpacing: "0.18em" }}>
            SK2FACE
          </span>
          <span className="text-[10px] tracking-[0.22em] text-gray-400 uppercase font-medium">
            National Forensic Face Recognition
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = activeLink === link.label;
          return (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className={`flex items-center gap-2 px-4 py-5 text-sm font-medium transition-all duration-200 border-b-2 ${
                  isActive
                    ? "text-yellow-400 border-yellow-400"
                    : "text-gray-300 border-transparent hover:text-white hover:border-gray-500"
                }`}
                style={{ textDecoration: "none" }}
              >
                <span className={isActive ? "text-yellow-400" : "text-gray-400"}>
                  {link.icon}
                </span>
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Right: Authenticated Personnel */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Authenticated Personnel</span>
          <a href="#" className="text-sm text-gray-200 hover:text-yellow-400 transition-colors font-medium">
            View Profile
          </a>
        </div>
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-[#2a3550] border-2 border-gray-500 overflow-hidden flex items-center justify-center">
            {/* Placeholder avatar */}
            <svg viewBox="0 0 40 40" width="40" height="40">
              <rect width="40" height="40" fill="#2a3550" />
              <circle cx="20" cy="16" r="7" fill="#4a5568" />
              <ellipse cx="20" cy="36" rx="13" ry="9" fill="#4a5568" />
            </svg>
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1a2235] rounded-full"></span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-600 mx-1" />

        {/* Logout */}
        <a
          href="#"
          className="text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <LuLogOut size={20} />
        </a>
      </div>
    </nav>
  );
}