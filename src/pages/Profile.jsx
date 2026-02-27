import React, { useEffect, useState } from "react";
import { FiEdit2, FiKey, FiShield } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

const Profile = () => {
  const [officer, setOfficer] = useState(null);

  useEffect(() => {
    const fetchOfficer = async () => {
      const response = {
        employeeId: "SK-94285",
        name: "Sarah Jenkins",
        fullName: "Det. Sarah Jenkins",
        designation: "Senior Forensic Analyst",
        department: "Digital Evidence Division",
        email: "s.jenkins@forensic.gov",
        phone: "+1 (555) 010-8899"
      };

      setOfficer(response);
    };

    fetchOfficer();
  }, []);

  if (!officer) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <Dashboard>
            <div className="min-h-screen bg-[#EEF1F4] flex flex-col">
        {/* PAGE TITLE */}
        <div className="text-center py-10">
            <h1 className="text-3xl font-bold text-[#0B1F3A]">
            Officer Profile
            </h1>
            <p className="text-gray-500 tracking-[0.2em] text-sm mt-2">
            AUTHORIZED FORENSIC PERSONNEL DETAILS
            </p>
        </div>

        {/* PROFILE CARD */}
        <div className="flex justify-center px-6 pb-16">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">

            {/* GOLD TOP ACCENT */}
            <div className="h-1.5 bg-amber-400" />

            <div className="px-10 py-12 text-center">

                {/* Dummy Profile Icon */}
                <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full bg-gray-100 
                                flex items-center justify-center
                                border-4 border-[#0B1F3A] shadow-md">
                    <FaUserCircle className="text-6xl text-gray-400" />
                </div>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-semibold text-[#0B1F3A] mt-5">
                {officer.name}
                </h2>

                <p className="text-amber-500 tracking-[0.25em] text-xs mt-1 font-medium">
                {officer.designation.toUpperCase()}
                </p>

                {/* INFO GRID */}
                <div className="grid md:grid-cols-2 gap-x-20 gap-y-10 mt-12 text-left">

                <Info label="EMPLOYEE ID" value={officer.employeeId} />
                <Info label="DESIGNATION" value={officer.designation} />

                <Info label="FULL NAME" value={officer.fullName} />
                <Info label="DEPARTMENT NAME" value={officer.department} />

                <Info label="OFFICIAL EMAIL" value={officer.email} />
                <Info label="PHONE NUMBER" value={officer.phone} />

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-center gap-6 mt-14">

                <button
                    className="
                    flex items-center gap-2
                    bg-[#0B1F3A] text-white
                    px-7 py-3 rounded-md
                    shadow-md
                    hover:bg-[#132c55]
                    transition duration-300"
                >
                    <FiEdit2 size={18} />
                    Edit Profile
                </button>

                <button
                    className="
                    flex items-center gap-2
                    border border-gray-400
                    px-7 py-3 rounded-md
                    hover:bg-gray-100
                    transition duration-300"
                >
                    <FiKey size={18} />
                    Change Password
                </button>

                </div>
            </div>

            {/* CONFIDENTIAL FOOTNOTE */}
            <div className="border-t bg-gray-50 py-4 flex justify-center items-center gap-2 text-xs text-gray-500">
                <FiShield />
                CONFIDENTIAL DATA — GOVERNMENT USE ONLY
            </div>

            </div>
        </div>
        </div>
    </Dashboard>
  );
};

/* REUSABLE INFO ROW */

const Info = ({ label, value }) => (
  <div>
    <p className="text-[11px] tracking-[0.2em] text-gray-400 mb-2">
      {label}
    </p>
    <p className="text-[#0B1F3A] font-semibold border-b border-gray-200 pb-2">
      {value}
    </p>
  </div>
);

export default Profile;