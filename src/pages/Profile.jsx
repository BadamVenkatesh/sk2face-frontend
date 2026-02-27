import React, { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiShield, FiX, FiCheck, FiMail, FiPhone, FiBriefcase, FiUser, FiHash } from "react-icons/fi";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { MdOutlineBusinessCenter } from "react-icons/md";
import Dashboard from "../components/Dashboard";

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ officer, onSave, onClose }) {
  const [form, setForm] = useState({ ...officer });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const fields = [
    { key: "name",        label: "Name",        icon: <FiUser size={15} /> },
    { key: "fullName",    label: "Full Name",    icon: <FiUser size={15} /> },
    { key: "designation", label: "Designation",  icon: <FiBriefcase size={15} /> },
    { key: "department",  label: "Department",   icon: <MdOutlineBusinessCenter size={15} /> },
    { key: "email",       label: "Official Email", icon: <FiMail size={15} /> },
    { key: "phone",       label: "Phone Number", icon: <FiPhone size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.25s_ease]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <FiEdit2 size={16} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Edit Profile</h3>
              <p className="text-white/40 text-[10px] tracking-widest uppercase">Update personnel details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <FiX size={16} className="text-white/70" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {fields.map(({ key, label, icon }) => (
            <div key={key}>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1.5 block">
                {label}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {icon}
                </span>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={handleChange(key)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafbfc] text-sm font-medium text-[#0B1F3A] outline-none focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 transition-all duration-200"
                />
              </div>
            </div>
          ))}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0B1F3A] text-yellow-400 hover:bg-[#162d52] transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <FiCheck size={15} />
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Info Field ───────────────────────────────────────────────────────────────

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 px-5 py-4 rounded-xl bg-[#fafbfc] border border-gray-100 hover:border-gray-200 hover:bg-white transition-all duration-200">
    <div className="w-9 h-9 rounded-lg bg-[#0B1F3A]/5 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-[#0B1F3A] truncate">
        {value}
      </p>
    </div>
  </div>
);

// ─── Profile Page ─────────────────────────────────────────────────────────────

const Profile = () => {
  const [officer, setOfficer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchOfficer = async () => {
      const response = {
        employeeId: "SK-94285",
        name: "Badam Venkatesh",
        fullName: "Badam Venkatesh",
        designation: "Senior Forensic Analyst",
        department: "Digital Evidence Division",
        email: "b.venkatesh@forensic.gov",
        phone: "+91 98765 43210",
      };
      setOfficer(response);
    };
    fetchOfficer();
  }, []);

  const handleSave = useCallback((updated) => {
    setOfficer(updated);
    setEditOpen(false);
  }, []);

  if (!officer) {
    return (
      <Dashboard>
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0B1F3A] rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading profile...</span>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="min-h-screen bg-[#f0f2f5] py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#13294B] to-[#1a3a5c] rounded-2xl shadow-xl text-white">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative px-8 pt-10 pb-8 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-lg">
                  <HiOutlineFingerPrint size={44} className="text-yellow-400" />
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-400 border-3 border-[#0B1F3A] rounded-full" />
              </div>

              {/* Name */}
              <h1 className="text-2xl font-extrabold tracking-wide">
                {officer.name}
              </h1>
              <p className="text-yellow-400 text-[11px] font-bold tracking-[0.25em] uppercase mt-1.5">
                {officer.designation}
              </p>
              <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5">
                <MdOutlineBusinessCenter size={13} />
                {officer.department}
              </p>

              {/* Edit button */}
              <button
                onClick={() => setEditOpen(true)}
                className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              >
                <FiEdit2 size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-1 h-5 rounded-full bg-yellow-500" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Personnel Details
              </h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                icon={<FiHash size={15} className="text-[#0B1F3A]/50" />}
                label="Employee ID"
                value={officer.employeeId}
              />
              <InfoField
                icon={<FiUser size={15} className="text-[#0B1F3A]/50" />}
                label="Full Name"
                value={officer.fullName}
              />
              <InfoField
                icon={<FiBriefcase size={15} className="text-[#0B1F3A]/50" />}
                label="Designation"
                value={officer.designation}
              />
              <InfoField
                icon={<MdOutlineBusinessCenter size={15} className="text-[#0B1F3A]/50" />}
                label="Department"
                value={officer.department}
              />
              <InfoField
                icon={<FiMail size={15} className="text-[#0B1F3A]/50" />}
                label="Official Email"
                value={officer.email}
              />
              <InfoField
                icon={<FiPhone size={15} className="text-[#0B1F3A]/50" />}
                label="Phone Number"
                value={officer.phone}
              />
            </div>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 py-3">
            <FiShield size={13} className="text-gray-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Confidential Data — Government Use Only
            </p>
          </div>

        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditModal
          officer={officer}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </Dashboard>
  );
};

export default Profile;