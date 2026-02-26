import { LuShield, LuLock } from "react-icons/lu";
import { FiDatabase, FiEyeOff, FiClock } from "react-icons/fi";
import { BsPersonBoundingBox, BsPencilSquare } from "react-icons/bs";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { MdOutlinePrivacyTip } from "react-icons/md";

import Header from "../components/Header";
import Footer from "../components/Footer";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const capabilities = [
  {
    icon: <BsPersonBoundingBox size={22} />,
    title: "Sketch Matching",
    desc: "Upload forensic sketches and compare them against national databases to retrieve top-ranked facial matches.",
  },
  {
    icon: <BsPencilSquare size={22} />,
    title: "Drag & Drop Builder",
    desc: "Create high-fidelity digital sketches with our intuitive drag-and-drop forensic drawing toolkit.",
  },
  {
    icon: <FiClock size={22} />,
    title: "Match History",
    desc: "Full audit trails of every search and identification. Securely log and review previous investigation results.",
  },
  {
    icon: <LuShield size={22} />,
    title: "Secure Access",
    desc: "Role-based authentication ensures only authorized law enforcement officers can access sensitive biometric data.",
  },
];

const securityPoints = [
  {
    icon: <MdOutlinePrivacyTip size={18} className="text-yellow-600" />,
    title: "Data Privacy Compliant",
    desc: "GDPR and local biometric law standards.",
  },
  {
    icon: <LuShield size={18} className="text-yellow-600" />,
    title: "Role-Based Access",
    desc: "Granular permissions for investigators.",
  },
  {
    icon: <LuLock size={18} className="text-yellow-600" />,
    title: "Encrypted Matching",
    desc: "End-to-end encryption for all data packets.",
  },
  {
    icon: <FiEyeOff size={18} className="text-yellow-600" />,
    title: "For Official Use Only",
    desc: "Restricted to authorized personnel only.",
  },
];

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#eef1f7] to-[#dde3f0] px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* Left — Text */}
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-gray-500 border border-gray-300 rounded-full px-3 py-1 bg-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            OFFICIAL FORENSIC PORTAL
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#0d1a2e]">
            AI-Powered<br />
            Forensic<br />
            <span className="text-yellow-500">Face Recognition</span>
          </h1>

          <p className="text-base font-semibold text-[#1a2235]">
            Enhancing Criminal Investigation with Intelligent Sketch-to-Photo Matching.
          </p>

          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            Professional-grade deep learning architecture designed for rapid identification,
            accurate forensic analysis, and secure evidentiary processing.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-3 bg-[#0d1a2e] text-white text-sm font-semibold rounded-lg hover:bg-[#162540] active:scale-95 transition-all duration-200 shadow-md"
            >
              <BsPersonBoundingBox size={16} />
              Start Matching
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#0d1a2e] text-sm font-semibold rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all duration-200"
            >
              <BsPencilSquare size={16} />
              Create Sketch
            </a>
          </div>
        </div>

        {/* Right — Face Scan Visual */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-[#0d1a2e]">
              <div
                className="relative w-full aspect-[4/5] bg-gradient-to-b from-[#0a1628] to-[#061020] flex items-center justify-center overflow-hidden"
              >
                {/* Background grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,200,150,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,0.4) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                {/* Corner scan brackets */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-teal-400 opacity-80" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-teal-400 opacity-80" />
                <div className="absolute bottom-16 left-8 w-12 h-12 border-b-2 border-l-2 border-teal-400 opacity-80" />
                <div className="absolute bottom-16 right-8 w-12 h-12 border-b-2 border-r-2 border-teal-400 opacity-80" />
                {/* Icon + pulse dots */}
                <div className="flex flex-col items-center gap-4">
                  <HiOutlineFingerPrint size={100} className="text-teal-400 opacity-60" />
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-teal-400 opacity-70 animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-teal-300 text-xs tracking-widest opacity-60">SCANNING...</span>
                </div>
              </div>
              {/* Accuracy badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0d1a2e]/90 backdrop-blur-sm border border-teal-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <LuShield size={20} className="text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] tracking-widest text-gray-400 uppercase">Match Accuracy</p>
                  <p className="text-white font-bold text-sm">99.8% Reliability</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function CoreCapabilities() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-yellow-600 uppercase mb-2">
            System Modules
          </p>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-extrabold text-[#0d1a2e]">Core Capabilities</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="group p-6 rounded-xl border border-gray-100 bg-[#f9fafb] hover:border-yellow-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-4 text-gray-600 group-hover:border-yellow-300 group-hover:text-yellow-600 transition-all duration-200">
                {cap.icon}
              </div>
              <h3 className="font-bold text-[#0d1a2e] text-sm mb-2">{cap.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="bg-[#f4f6fb] px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14">

        {/* Left — Text + security points */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-extrabold text-[#0d1a2e] leading-tight">
            Secure. Reliable.{" "}
            <span className="text-yellow-500">Government-Grade.</span>
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed max-w-md">
            Our platform is engineered to meet the stringent security and data privacy
            requirements of federal and local law enforcement agencies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {securityPoints.map((pt) => (
              <div key={pt.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {pt.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d1a2e]">{pt.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Server visual */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl border-4 border-white shadow-2xl overflow-hidden">
            <div
              className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#061020] to-[#0a1628] flex items-center justify-center"
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,100,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <FiDatabase size={80} className="text-blue-400 opacity-40" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                {[100, 72, 88].map((w, i) => (
                  <div key={i} className="h-1.5 bg-blue-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full opacity-60 animate-pulse"
                      style={{ width: `${w}%`, animationDelay: `${i * 300}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <CoreCapabilities />
        <SecuritySection />
      </main>
      <Footer />
    </div>
  );
}