import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { HiOutlineFingerPrint } from "react-icons/hi";
import Dashboard from "../components/Dashboard";

export default function MatchingHistoryCard() {
  const [data, setData] = useState([]);

  // Simulated backend fetch
  useEffect(() => {
    async function fetchData() {
      // Replace with real API call
      // const res = await fetch("/api/matching-history");
      // const json = await res.json();

      const json = [
        {
          inputSketch: "https://randomuser.me/api/portraits/men/32.jpg",
          topImages: [
            { img: "https://randomuser.me/api/portraits/women/44.jpg", similarity: 94.2 },
            { img: "https://randomuser.me/api/portraits/women/65.jpg", similarity: 82.7 },
            { img: "https://randomuser.me/api/portraits/women/12.jpg", similarity: 71.3 },
          ],
        },
        {
          inputSketch: "https://randomuser.me/api/portraits/women/22.jpg",
          topImages: [
            { img: "https://randomuser.me/api/portraits/men/41.jpg", similarity: 78.5 },
            { img: "https://randomuser.me/api/portraits/men/52.jpg", similarity: 65.9 },
            { img: "https://randomuser.me/api/portraits/men/62.jpg", similarity: 54.1 },
          ],
        },
        {
          inputSketch: "https://randomuser.me/api/portraits/men/75.jpg",
          topImages: [
            { img: "https://randomuser.me/api/portraits/women/10.jpg", similarity: 62.1 },
            { img: "https://randomuser.me/api/portraits/women/20.jpg", similarity: 55.4 },
            { img: "https://randomuser.me/api/portraits/women/30.jpg", similarity: 48.8 },
          ],
        },
      ];

      setData(json);
    }

    fetchData();
  }, []);

  const getBarGradient = (value) => {
    if (value >= 85) return "from-emerald-400 to-emerald-600";
    if (value >= 70) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  const getTextColor = (value) => {
    if (value >= 85) return "text-emerald-500";
    if (value >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getBadgeStyle = (value) => {
    if (value >= 85) return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    if (value >= 70) return "bg-amber-500/10 text-amber-600 border-amber-200";
    return "bg-red-500/10 text-red-600 border-red-200";
  };

  const getLabel = (value) => {
    if (value >= 85) return "HIGH";
    if (value >= 70) return "MODERATE";
    return "LOW";
  };

  return (
    <Dashboard>
      <div className="min-h-screen bg-[#f0f2f5] py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Page Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#13294B] to-[#1a3a5c] rounded-2xl px-7 py-8 text-white shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/[0.03] rounded-full -translate-y-1/3 translate-x-1/4" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <FiClock size={22} className="text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-wide">
                  Match History
                </h1>
                <p className="text-sm text-white/50 mt-0.5">
                  Review your past forensic sketch-to-photo matching results
                </p>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
              {data.length} matching record{data.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* History Cards */}
          <div className="space-y-5">
            {data.map((row, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card top accent */}
                <div className="h-1 bg-gradient-to-r from-[#0B1F3A] via-[#1a3a5c] to-yellow-500" />

                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Left — Input Sketch */}
                  <div className="flex flex-col items-center gap-3 md:border-r md:border-gray-100 md:pr-6 shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                      Input Sketch
                    </p>
                    <div className="relative">
                      <img
                        src={row.inputSketch}
                        alt="Sketch"
                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm group-hover:border-[#0B1F3A]/30 transition-colors duration-300"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0B1F3A] border-2 border-white flex items-center justify-center">
                        <HiOutlineFingerPrint size={12} className="text-yellow-400" />
                      </div>
                    </div>
                  </div>

                  {/* Right — Similar Images */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3 flex items-center gap-2">
                      <BsPersonBoundingBox size={12} className="text-[#0B1F3A]" />
                      Top Similar Matches
                    </p>

                    <div className="flex flex-col gap-3">
                      {row.topImages.map((match, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#fafbfc] border border-gray-100 hover:border-gray-200 hover:bg-[#f5f6f8] transition-all duration-200"
                        >
                          {/* S.No badge */}
                          <div className="w-7 h-7 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-yellow-400">{i + 1}</span>
                          </div>

                          {/* Image */}
                          <img
                            src={match.img}
                            alt={`Match ${i + 1}`}
                            className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                          />

                          {/* Progress bar */}
                          <div className="flex-1 min-w-0">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(match.similarity)} transition-all duration-700`}
                                style={{ width: `${match.similarity}%` }}
                              />
                            </div>
                          </div>

                          {/* Score + label */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-lg font-extrabold ${getTextColor(match.similarity)}`}>
                              {match.similarity}%
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getBadgeStyle(match.similarity)}`}>
                              {getLabel(match.similarity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-2 py-3 text-sm">
            <span className="text-xs text-gray-400 font-medium">
              Showing 1 to {data.length} results
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0B1F3A] text-yellow-400 border border-[#0B1F3A] shadow-sm">
                1
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </Dashboard>
  );
}