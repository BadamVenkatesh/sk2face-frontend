import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { 
  IdCard, 
  Lock, 
  AlertCircle, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';

import { registerUser, clearAuthError } from '../store/authSlice';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    officialEmail: '',
    phoneNumber: '',
    designation: '',
    departmentName: 'Digital Forensics',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return setPasswordStrength('');
    if (password.length < 6) setPasswordStrength('WEAK');
    else if (password.length < 10) setPasswordStrength('MEDIUM');
    else setPasswordStrength('STRONG');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      dispatch(clearAuthError());
      setSuccessMessage('');
      return alert('Passwords do not match');
    }

    setSuccessMessage('');

    try {
      await dispatch(
        registerUser({
          username: formData.username,
          password: formData.password,
          employeeId: formData.employeeId,
          fullName: formData.fullName,
          officialEmail: formData.officialEmail,
          designation: formData.designation,
          departmentName: formData.departmentName,
          phoneNumber: formData.phoneNumber,
        })
      ).unwrap();

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch {
      // Error is already in Redux state
    }
  };

  const handleClear = () => {
    setFormData({
      employeeId: '',
      fullName: '',
      officialEmail: '',
      phoneNumber: '',
      designation: '',
      departmentName: 'Digital Forensics',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setPasswordStrength('');
    setSuccessMessage('');
    dispatch(clearAuthError());
  };

  const inputStyle =
    "w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 " +
    "focus:ring-2 focus:ring-blue-500 focus:border-transparent " +
    "hover:border-blue-400 hover:shadow-sm transition-all duration-200";

  return (
    <>
      <Header />

      <div className="bg-gray-50 py-12 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="mb-10 border-l-4 border-yellow-500 pl-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forensic Officer Registration
            </h1>
            <p className="text-gray-600">
              Complete the secure multi-factor identity verification form to gain access to the secure portal.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 text-center font-medium">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Official Identification */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <IdCard className="h-5 w-5 text-gray-900" />
                  <h2 className="text-xl font-bold text-gray-900">Official Identification</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} placeholder="e.g. FED-99281" inputStyle={inputStyle} />

                  <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Legal Name as per ID" inputStyle={inputStyle} />

                  <Input label="Official Email" name="officialEmail" type="email" value={formData.officialEmail} onChange={handleInputChange} placeholder="officer@agency.gov" inputStyle={inputStyle} />

                  <Input label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+1 (555) 000-0000" inputStyle={inputStyle} />

                  <Input label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Lead Investigator" inputStyle={inputStyle} />

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2 text-xs uppercase tracking-wide">
                      Department Name
                    </label>
                    <div className="relative">
                      <select
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleInputChange}
                        className={`${inputStyle} appearance-none cursor-pointer`}
                      >
                        <option>Digital Forensics</option>
                        <option>Cyber Crime</option>
                        <option>Criminal Investigation</option>
                        <option>Forensic Science</option>
                        <option>Pathology</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"/>
                    </div>
                  </div>

                </div>
              </div>

              {/* Account Credentials */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-gray-900" />
                  <h2 className="text-xl font-bold text-gray-900">Account Credentials</h2>
                </div>

                <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} placeholder="Choose a unique username" inputStyle={inputStyle} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                  <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    show={showPassword}
                    toggle={() => setShowPassword(!showPassword)}
                    inputStyle={inputStyle}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    show={showConfirmPassword}
                    toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    inputStyle={inputStyle}
                  />

                </div>
              </div>

              {/* Disclosure */}
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3 hover:bg-gray-100 transition-all duration-200">
                <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5"/>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-semibold">Official Disclosure:</span> By submitting this form, you acknowledge that all information provided is accurate.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg
                  hover:bg-gray-50 hover:shadow-sm hover:-translate-y-[1px]
                  transition-all duration-200"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold rounded-lg
                  hover:from-blue-800 hover:to-blue-700
                  hover:shadow-lg hover:-translate-y-[1px]
                  active:scale-[0.98]
                  transition-all duration-200 flex items-center gap-2
                  disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegistrationForm;

/* Small reusable components */

const Input = ({ label, name, value, onChange, placeholder, type="text", inputStyle }) => (
  <div>
    <label className="block text-gray-900 font-semibold mb-2 text-xs uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyle}
    />
  </div>
);

const PasswordInput = ({ label, name, value, onChange, show, toggle, inputStyle }) => (
  <div>
    <label className="block text-gray-900 font-semibold mb-2 text-xs uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Enter password"
        className={`${inputStyle} pr-12`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
      >
        {show
          ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-700 transition-colors duration-200"/>
          : <Eye className="h-5 w-5 text-gray-400 hover:text-blue-700 transition-colors duration-200"/>}
      </button>
    </div>
  </div>
);