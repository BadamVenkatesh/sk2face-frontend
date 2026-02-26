import { LuLogIn, LuUserPlus } from "react-icons/lu";

export default function Header() {
  return (
    <nav className="w-full bg-[#1a2235] text-white flex items-center justify-between px-6 shadow-lg" style={{ minHeight: 60 }}>

      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2a3550] border-2 border-yellow-500 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 40 40" width="36" height="36">
            <circle cx="20" cy="20" r="18" fill="#1a2235" stroke="#c9a227" strokeWidth="2" />
            <text x="50%" y="55%" textAnchor="middle" fill="#c9a227" fontSize="13" fontWeight="bold" fontFamily="serif">ก</text>
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-extrabold text-lg" style={{ letterSpacing: "0.18em" }}>
            SK2FACE
          </span>
          <span className="text-[10px] tracking-[0.22em] text-gray-400 uppercase font-medium">
            National Forensic Face Recognition
          </span>
        </div>
      </div>

      {/* Right: Login + Register */}
      <div className="flex items-center gap-3">

        {/* Login — ghost style */}
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-md transition-all duration-200 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/5 group"
        >
          <LuLogIn size={16} className="text-gray-500 group-hover:text-yellow-400 transition-colors duration-200" />
          Login
        </a>

        {/* Register — filled style */}
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1a2235] bg-yellow-400 rounded-md transition-all duration-200 hover:bg-yellow-300 hover:shadow-[0_0_12px_rgba(234,179,8,0.4)] active:scale-95 group"
        >
          <LuUserPlus size={16} />
          Register
        </a>

      </div>
    </nav>
  );
}