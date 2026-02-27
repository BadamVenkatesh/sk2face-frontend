import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiClock } from "react-icons/fi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { HiOutlineFingerPrint } from "react-icons/hi";
import Dashboard from "../components/Dashboard";

import { fetchMatchHistory } from "../store/matchSlice";
import axiosInstance from "../api/axiosInstance";

// Backend base URL — used to resolve server-side image paths
const API_BASE_URL = axiosInstance.defaults.baseURL || "";

/**
 * Resolve an image URL from the API.
 * - Full http(s) URLs pointing to accessible hosts → pass through
 * - Internal Docker URLs (e.g. http://ml-service:9090/static/photos/...) → rewrite to local /static/photos/...
 * - Server-relative paths (e.g. /app/data/...) → prepend backend base URL
 */
function resolveImageUrl(url) {
  if (!url) return "";

  // Internal Docker service URL → rewrite to use our local static junction
  if (url.includes("ml-service:") || url.includes("ml_service:")) {
    try {
      const parsed = new URL(url);
      return parsed.pathname; // e.g. /static/photos/f-040-01.jpg
    } catch {
      return url;
    }
  }

  // Already a full URL pointing somewhere accessible → use as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Server-relative path (e.g. /app/data/...) → prepend backend URL
  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  }

  return url;
}

/**
 * Image component that handles ngrok-hosted images by fetching them
 * through axiosInstance (which sends the ngrok-skip-browser-warning header).
 * Regular images (local /static/photos/...) are rendered normally.
 */
function ProxiedImage({ src, alt, className, onError }) {
  const [blobSrc, setBlobSrc] = useState(null);
  const [failed, setFailed] = useState(false);
  const needsProxy = src && API_BASE_URL && src.startsWith(API_BASE_URL);

  useEffect(() => {
    if (!needsProxy || !src) return;

    let cancelled = false;
    const path = src.replace(API_BASE_URL, "");

    axiosInstance
      .get(path, { responseType: "blob" })
      .then((res) => {
        if (!cancelled) {
          setBlobSrc(URL.createObjectURL(res.data));
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (blobSrc) URL.revokeObjectURL(blobSrc);
    };
  }, [src, needsProxy]);

  if (failed) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", color: "#9ca3af", fontSize: 10, textAlign: "center" }}>
        Image unavailable
      </div>
    );
  }

  const finalSrc = needsProxy ? blobSrc : src;
  if (needsProxy && !blobSrc) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0B1F3A] rounded-full animate-spin" />
      </div>
    );
  }

  return <img src={finalSrc} alt={alt} className={className} onError={onError} />;
}

export default function MatchingHistoryCard() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.match);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchMatchHistory({ page, size: pageSize }));
  }, [dispatch, page]);

  // ── Transform API data to display format ──
  const data = React.useMemo(() => {
    if (!history?.content) return [];

    return history.content.map((entry) => ({
      inputSketch: resolveImageUrl(entry.inputImageUrl),
      status: entry.status,
      createdAt: entry.createdAt,
      topImages: [
        entry.match1 && { img: resolveImageUrl(entry.match1.url), similarity: Math.round((entry.match1.score || 0) * 100 * 10) / 10 },
        entry.match2 && { img: resolveImageUrl(entry.match2.url), similarity: Math.round((entry.match2.score || 0) * 100 * 10) / 10 },
        entry.match3 && { img: resolveImageUrl(entry.match3.url), similarity: Math.round((entry.match3.score || 0) * 100 * 10) / 10 },
      ].filter(Boolean),
    }));
  }, [history]);

  const totalPages = history?.totalPages || 1;
  const totalElements = history?.totalElements || data.length;

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

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0B1F3A] rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading history...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center font-medium">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
                  {totalElements} matching record{totalElements !== 1 ? "s" : ""}
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
                          <ProxiedImage
                            src={row.inputSketch}
                            alt="Sketch"
                            className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm group-hover:border-[#0B1F3A]/30 transition-colors duration-300"
                          />
                          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0B1F3A] border-2 border-white flex items-center justify-center">
                            <HiOutlineFingerPrint size={12} className="text-yellow-400" />
                          </div>
                        </div>
                        {row.createdAt && (
                          <p className="text-[9px] text-gray-400 font-medium">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </p>
                        )}
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
                              <ProxiedImage
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
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-2 py-4">
                  <span className="text-xs text-gray-400 font-medium">
                    Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalElements)} of {totalElements} records
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Previous */}
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>

                    {/* Page numbers */}
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;

                      let start = Math.max(0, page - Math.floor(maxVisible / 2));
                      let end = Math.min(totalPages - 1, start + maxVisible - 1);
                      start = Math.max(0, end - maxVisible + 1);

                      // First page + ellipsis
                      if (start > 0) {
                        pages.push(
                          <button key={0} onClick={() => setPage(0)}
                            className="w-9 h-9 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200">
                            1
                          </button>
                        );
                        if (start > 1) {
                          pages.push(
                            <span key="start-ellipsis" className="text-xs text-gray-400 px-1">…</span>
                          );
                        }
                      }

                      // Visible page buttons
                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 ${
                              i === page
                                ? "bg-[#0B1F3A] text-yellow-400 border border-[#0B1F3A] shadow-sm"
                                : "text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      }

                      // Last page + ellipsis
                      if (end < totalPages - 1) {
                        if (end < totalPages - 2) {
                          pages.push(
                            <span key="end-ellipsis" className="text-xs text-gray-400 px-1">…</span>
                          );
                        }
                        pages.push(
                          <button key={totalPages - 1} onClick={() => setPage(totalPages - 1)}
                            className="w-9 h-9 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200">
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}

                    {/* Next */}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </Dashboard>
  );
}