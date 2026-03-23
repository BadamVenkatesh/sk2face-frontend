const contributors = ["Badam Venkatesh", "Valakati Sri Sairam", "Thatipalli Sai Shiva"];

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Top gold divider line */}
      <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

      {/* Dark footer body */}
      <div className="bg-[#0d1526] text-white w-full">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center gap-4">

          {/* Brand */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-2xl font-extrabold text-white" style={{ letterSpacing: "0.3em" }}>
              SK2FACE
            </span>
            <div className="w-12 h-[2px] rounded-full bg-yellow-500" />
          </div>

          {/* Contributors */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold">
              Project Contributors
            </span>
            <p className="text-sm font-semibold text-gray-100 text-center tracking-wide">
              {contributors.map((name, i) => (
                <span key={name}>
                  <span className="hover:text-yellow-400 transition-colors duration-200 cursor-default">
                    {name}
                  </span>
                  {i < contributors.length - 1 && (
                    <span className="text-yellow-500 mx-3">•</span>
                  )}
                </span>
              ))}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}