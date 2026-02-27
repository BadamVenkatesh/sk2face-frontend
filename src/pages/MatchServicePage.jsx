import { useState, useRef } from "react";
import { FiUploadCloud, FiSearch, FiShield } from "react-icons/fi";
import { BsPersonBoundingBox } from "react-icons/bs";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

// ─── MOCK MATCH RESULTS (replace with real API response) ─────────────────────

const mockMatches = [
  {
    id: "ID-88294-TX",
    confidence: 94.2,
    level: "HIGH CONFIDENCE",
    color: "text-emerald-600",
    barColor: "bg-emerald-500",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "ID-11023-CA",
    confidence: 78.5,
    level: "MODERATE CONFIDENCE",
    color: "text-amber-500",
    barColor: "bg-amber-400",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "ID-54911-NY",
    confidence: 64.1,
    level: "LOW CONFIDENCE",
    color: "text-red-500",
    barColor: "bg-red-500",
    img: "https://randomuser.me/api/portraits/women/72.jpg",
  },
];

// ─── UPLOAD PANEL ─────────────────────────────────────────────────────────────

function UploadPanel({ file, onFileChange, onDrop, isDragging, setIsDragging, onMatch }) {
  const inputRef = useRef();

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); onDrop(e.dataTransfer.files[0]); };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <FiUploadCloud size={18} className="text-[#0B1F3A]" />
        <h2 className="text-base font-bold text-[#0B1F3A]">Upload Sketch</h2>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`flex-1 min-h-[280px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[#0B1F3A] bg-blue-50"
            : file
            ? "border-emerald-400 bg-emerald-50"
            : "border-gray-300 bg-gray-50 hover:border-[#0B1F3A] hover:bg-gray-100"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.tiff"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files[0])}
        />

        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded sketch"
              className="w-32 h-32 object-cover rounded-lg shadow"
            />
            <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
            <p className="text-xs text-gray-400">Click to replace</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUploadCloud size={26} className="text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-[#0B1F3A]">Drag and drop forensic sketch here</p>
            <p className="text-xs text-gray-400">Supported formats: JPG, PNG, TIFF (Max 10MB)</p>
            <button
              type="button"
              className="mt-1 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border border-[#0B1F3A] rounded-lg hover:bg-[#0B1F3A] hover:text-white transition-all duration-200"
              onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
            >
              Browse Files
            </button>
          </>
        )}
      </div>

      {/* Start Matching button */}
      <button
        onClick={onMatch}
        disabled={!file}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0B1F3A] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#162d52] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
      >
        <FiSearch size={16} />
        Start Matching
      </button>

      {/* Security notice */}
      <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-gray-50 border border-gray-100">
        <FiShield size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-400 italic leading-relaxed">
          Authorized access only. All matching queries are logged and monitored in
          compliance with federal biometric security protocols.
        </p>
      </div>
    </div>
  );
}

// ─── RESULTS PANEL ────────────────────────────────────────────────────────────

function ResultsPanel({ results, hasSearched }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BsPersonBoundingBox size={18} className="text-[#0B1F3A]" />
          <h2 className="text-base font-bold text-[#0B1F3A]">Top 3 Similar Matches</h2>
        </div>
        {hasSearched && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 border border-gray-200 rounded px-2 py-1 bg-gray-50">
            Live Database Analysis
          </span>
        )}
      </div>

      {/* Empty state */}
      {!hasSearched ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FiSearch size={28} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-400">No results yet</p>
          <p className="text-xs text-gray-300 max-w-xs">Upload a forensic sketch and click Start Matching to retrieve results from the national database.</p>
        </div>
      ) : (
        <>
          {/* Match cards */}
          <div className="flex flex-col gap-4">
            {results.map((match, i) => (
              <div
                key={match.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-[#fafafa] hover:border-gray-200 hover:shadow-sm transition-all duration-150"
              >
                {/* Rank */}
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>

                {/* Photo */}
                <img
                  src={match.img}
                  alt={`Match ${i + 1}`}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                />

                {/* Progress bar */}
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${match.barColor} transition-all duration-700`}
                      style={{ width: `${match.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-xl font-extrabold ${match.color}`}>
                    {match.confidence}%
                  </p>
                  <p className={`text-[9px] font-bold uppercase tracking-wider ${match.color}`}>
                    {match.level}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function MatchServicePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);

  const handleMatch = () => {
    if (!file) return;
    // Simulate API call — replace with real fetch
    setResults(mockMatches);
    setHasSearched(true);
  };

  return (
    <Dashboard>
        <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
            <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-10 space-y-8">

                {/* Page heading */}
                <div className="text-center space-y-3">
                <h1 className="text-3xl font-extrabold tracking-[0.15em] text-[#0B1F3A] uppercase">
                    Sketch Matching Service
                </h1>
                {/* Gold divider */}
                <div className="w-16 h-[3px] rounded-full bg-yellow-500 mx-auto" />
                <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                    Upload a forensic sketch to retrieve the most similar images from the national criminal database.
                </p>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <UploadPanel
                    file={file}
                    onFileChange={setFile}
                    onDrop={setFile}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onMatch={handleMatch}
                />
                <ResultsPanel results={results} hasSearched={hasSearched} />
                </div>

            </main>
        </div>
    </Dashboard>

  );
}