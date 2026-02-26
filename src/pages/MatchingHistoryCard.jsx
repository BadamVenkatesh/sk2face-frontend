import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
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
          matchId: "M-92810",
          dateTime: "2023-10-24T14:22:10",
          inputSketch:
            "https://randomuser.me/api/portraits/men/32.jpg",
          topImages: [
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/women/65.jpg",
            "https://randomuser.me/api/portraits/women/12.jpg"
          ],
          similarity: 94.2
        },
        {
          matchId: "M-92754",
          dateTime: "2023-10-23T09:15:45",
          inputSketch:
            "https://randomuser.me/api/portraits/women/22.jpg",
          topImages: [
            "https://randomuser.me/api/portraits/men/41.jpg",
            "https://randomuser.me/api/portraits/men/52.jpg",
            "https://randomuser.me/api/portraits/men/62.jpg"
          ],
          similarity: 78.5
        },
        {
          matchId: "M-92612",
          dateTime: "2023-10-21T16:50:30",
          inputSketch:
            "https://randomuser.me/api/portraits/men/75.jpg",
          topImages: [
            "https://randomuser.me/api/portraits/women/10.jpg",
            "https://randomuser.me/api/portraits/women/20.jpg",
            "https://randomuser.me/api/portraits/women/30.jpg"
          ],
          similarity: 62.1
        }
      ];

      setData(json);
    }

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }) + " " + d.toLocaleTimeString();
  };

  const getBarColor = (value) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 70) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <Dashboard>
        <div className="bg-[#f2f4f7] py-12 px-4">
      <div className="h-6" />

      <div className="max-w-6xl mx-auto">

        {/* FILTER CARD */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="grid md:grid-cols-4 gap-4 items-end">

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Search Match ID
              </label>
              <div className="relative mt-2">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. M-7821..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0b2544] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                From Date
              </label>
              <div className="relative mt-2">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0b2544] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">
                To Date
              </label>
              <div className="relative mt-2">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0b2544] outline-none"
                />
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 bg-[#0b2544] text-white py-2 rounded-lg hover:bg-[#081a30] transition">
              <FaFilter />
              Filter
            </button>

          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Match ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Input Sketch</th>
                  <th className="px-6 py-4">Top Similar Images</th>
                  <th className="px-6 py-4">Similarity</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-6 font-semibold text-[#0b2544]">
                      #{row.matchId}
                    </td>

                    <td className="px-6 py-6 text-gray-600">
                      {formatDate(row.dateTime)}
                    </td>

                    <td className="px-6 py-6">
                      <img
                        src={row.inputSketch}
                        alt="Sketch"
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    </td>

                    <td className="px-6 py-6 flex gap-2">
                      {row.topImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Top Match"
                          className="w-12 h-12 rounded-md object-cover border"
                        />
                      ))}
                    </td>

                    <td className="px-6 py-6">
                      <div className="text-sm font-semibold mb-2">
                        {row.similarity}%
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${getBarColor(
                            row.similarity
                          )}`}
                          style={{ width: `${row.similarity}%` }}
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t text-sm text-gray-500">
            <span>Showing 1 to {data.length} results</span>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1 bg-[#0b2544] text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
      <div className="h-6" />
    </div>
    </Dashboard>
  );
}