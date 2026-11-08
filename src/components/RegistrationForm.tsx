import React, { useState } from 'react';
import { UserPlus, CheckCircle2, ShieldCheck, Upload, RefreshCw, Printer, Copy, Check, AlertCircle, Calendar, MapPin, User, Mail, Phone, Briefcase } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Member } from '../types.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

const ODISHA_DISTRICTS = [
  'Nuapada',
  'Balangir',
  'Bargarh',
  'Sambalpur',
  'Kalahandi',
  'Subarnapur (Sonepur)',
  'Jharsuguda',
  'Sundargarh',
  'Deogarh',
  'Cuttack',
  'Khordha (Bhubaneswar)',
  'Puri',
  'Ganjam',
  'Koraput',
  'Rayagada',
  'Angul',
  'Dhenkanal',
  'Keonjhar',
  'Mayurbhanj',
  'Balasore',
  'Bhadrak',
  'Jajpur',
  'Kendrapara',
  'Jagatsinghpur',
  'Nayagarh',
  'Kandhamal',
  'Boudh',
  'Nabarangpur',
  'Malkangiri',
  'Gajapati',
  'Other District / State',
];

interface RegistrationFormProps {
  onCheckStatusClick: () => void;
  onOpenTerms: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onCheckStatusClick,
  onOpenTerms,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    mobileNumber: '',
    email: '',
    dob: '',
    gender: 'Male',
    fullAddress: '',
    village: '',
    district: 'Nuapada',
    state: 'Odisha',
    pincode: '',
    occupation: '',
    profilePhotoUrl: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMember, setSuccessMember] = useState<Member | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Real Mobile OTP States
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpDispatchedMessage, setOtpDispatchedMessage] = useState('');
  const [simulationOtp, setSimulationOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  React.useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const cleanPhone = formData.mobileNumber.replace(/[^0-9]/g, '').slice(-10);

  const handleSendOtp = async () => {
    setErrorMessage('');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await apiService.sendDonationOtp(cleanPhone, formData.fullName || 'Member Applicant');
      if (res.success) {
        setOtpRequested(true);
        setOtpDispatchedMessage(res.message || `OTP sent to +91 ${cleanPhone}`);
        if (res.simulationOtp) {
          setSimulationOtp(res.simulationOtp);
        }
        setCountdown(60);
      } else {
        setErrorMessage(res.error || 'Failed to dispatch OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while dispatching OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage('');
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await apiService.verifyDonationOtp(cleanPhone, otpCode.trim());
      if (res.success && res.verified) {
        setIsOtpVerified(true);
        setOtpDispatchedMessage('Mobile number verified successfully!');
      } else {
        setErrorMessage(res.error || 'Invalid OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'mobileNumber' && isOtpVerified) {
        setIsOtpVerified(false);
        setOtpRequested(false);
        setOtpCode('');
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage('Photo file size exceeds 3MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.termsAccepted) {
      setErrorMessage('Please accept the Organisation Terms & Conditions to proceed.');
      return;
    }

    if (!formData.fullName || !formData.fatherName || !formData.mobileNumber || !formData.village || !formData.pincode) {
      setErrorMessage('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    const clean = formData.mobileNumber.replace(/[^0-9]/g, '').slice(-10);
    if (clean.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.registerMember({
        ...formData,
        mobileNumber: clean,
      });
      if (response.success && response.member) {
        setIsOtpVerified(true);
        setSuccessMember(response.member);
      } else {
        setErrorMessage(response.error || 'Failed to submit registration. Please verify details and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (successMember?.registrationId) {
      navigator.clipboard.writeText(successMember.registrationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="register" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            <UserPlus className="w-3.5 h-3.5 text-blue-700" />
            <span>Official Membership Portal</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Online Member Registration
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Join LDA (Liberal Democratic Association – Laba Suna Organisation) to participate in community development, social justice drives, and voluntary humanitarian work across Odisha.
          </p>
        </div>

        {/* If successfully registered, show Official Digital ID Card */}
        {successMember ? (
          <div className="bg-white rounded-3xl border border-blue-200 shadow-2xl p-6 sm:p-10 text-center animate-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Registration Successfully Submitted!
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Your application has been logged into the LDA central database and transmitted directly to the Admin council for review.
            </p>

            {/* Official Digital Membership Card Preview */}
            <div className="mt-8 max-w-xl mx-auto bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-400/80 text-left relative overflow-hidden print:border-black print:text-black print:bg-white">
              
              {/* Background emblem watermark */}
              <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
                <img src={BRAND_ASSETS.logo} alt="LDA Watermark" className="w-48 h-48" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={BRAND_ASSETS.logo}
                    alt="LDA Emblem"
                    className="w-12 h-12 rounded-full border border-amber-400"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-serif text-white tracking-wide">
                      Liberal Democratic Association (LDA)
                    </h4>
                    <p className="text-[11px] text-amber-300 font-medium">
                      Laba Suna Organisation • Lathore, Odisha
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-wider">
                    Member Slip
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                
                {/* Photo */}
                <div className="sm:col-span-4 flex flex-col items-center">
                  <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-800 flex items-center justify-center">
                    {successMember.profilePhotoUrl ? (
                      <img
                        src={successMember.profilePhotoUrl}
                        alt={successMember.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <span className="mt-2 text-[10px] text-blue-200 font-mono font-bold">
                    {successMember.status}
                  </span>
                </div>

                {/* Details */}
                <div className="sm:col-span-8 space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Full Name</span>
                    <span className="text-sm font-bold text-white">{successMember.fullName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Father's Name</span>
                      <span className="text-slate-200 font-medium">{successMember.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Occupation</span>
                      <span className="text-slate-200 font-medium">{successMember.occupation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Village / District</span>
                      <span className="text-slate-200 font-medium">{successMember.village}, {successMember.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Registered On</span>
                      <span className="text-slate-200 font-medium">
                        {new Date(successMember.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Highlight Registration ID */}
                  <div className="pt-2">
                    <span className="text-amber-400 text-[10px] uppercase font-bold block">Unique Registration ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-mono text-amber-300 tracking-wider">
                        {successMember.registrationId}
                      </span>
                      <button
                        onClick={handleCopyId}
                        className="p-1 rounded bg-blue-800 hover:bg-blue-700 text-xs text-white transition cursor-pointer"
                        title="Copy Registration ID"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-blue-900/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Verified under Advocate Laba Suna</span>
                <span>Check status anytime at www.lda-odisha.org</span>
              </div>

            </div>

            {/* Action buttons on success */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Print / Save Slip (PDF)</span>
              </button>

              <button
                onClick={onCheckStatusClick}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Track Application Status</span>
              </button>

              <button
                onClick={() => {
                  setSuccessMember(null);
                  setFormData({
                    fullName: '',
                    fatherName: '',
                    mobileNumber: '',
                    email: '',
                    dob: '',
                    gender: 'Male',
                    fullAddress: '',
                    village: '',
                    district: 'Nuapada',
                    state: 'Odisha',
                    pincode: '',
                    occupation: '',
                    profilePhotoUrl: '',
                    termsAccepted: false,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Register Another Member
              </button>
            </div>

          </div>
        ) : (
          /* Registration Form Container */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Form Top Ribbon */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-serif">
                    LDA Central Membership Form
                  </h3>
                  <p className="text-xs text-blue-200">
                    All citizens committed to social welfare are eligible to register
                  </p>
                </div>
              </div>
              <div className="text-xs bg-blue-800/80 px-3 py-1 rounded-full border border-blue-700 font-mono">
                Date: {todayDate}
              </div>
            </div>

            {errorMessage && (
              <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
              
              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <User className="w-4 h-4 text-blue-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    1. Personal Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Enter Your Full Name"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Father's / Guardian's Name *
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="e.g. Enter Fullname Parents"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Occupation / Profession *
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="e.g. Enter Your Occupation"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  {/* Profile Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Profile Photograph (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id="profilePhotoInput"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="profilePhotoInput"
                        className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-700" />
                        <span>Choose Photo</span>
                      </label>
                      {formData.profilePhotoUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.profilePhotoUrl}
                            alt="Preview"
                            className="w-8 h-8 rounded-full object-cover border border-blue-500"
                          />
                          <span className="text-[11px] text-emerald-600 font-medium">Photo attached</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">JPG/PNG up to 3MB</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Phone className="w-4 h-4 text-blue-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    2. Contact Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Mobile Number * (10 Digits)
                      </label>
                      {isOtpVerified && (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-semibold">+91</span>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter Your Mobile Number"
                        maxLength={10}
                        required
                        disabled={isOtpVerified}
                        className={`w-full pl-12 pr-28 py-2.5 text-sm rounded-lg border outline-hidden transition ${
                          isOtpVerified
                            ? 'bg-emerald-50/40 border-emerald-300 font-semibold text-emerald-950'
                            : 'bg-slate-50/50 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                      {!isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={cleanPhone.length !== 10 || otpLoading || countdown > 0}
                          className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-md transition cursor-pointer"
                        >
                          {otpLoading ? 'Sending...' : otpRequested ? (countdown > 0 ? `${countdown}s` : 'Resend') : 'Get OTP'}
                        </button>
                      )}
                    </div>

                    {/* OTP verification box when requested */}
                    {otpRequested && !isOtpVerified && (
                      <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5 text-left animate-in fade-in">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-blue-900 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Enter 6-Digit OTP</span>
                          </span>
                          {countdown > 0 && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              Resend in {countdown}s
                            </span>
                          )}
                        </div>

                        {simulationOtp && (
                          <div className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">SMS Verification Code:</span>
                              <span className="font-mono font-black text-blue-900 tracking-wider text-sm">{simulationOtp}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOtpCode(simulationOtp)}
                              className="px-2 py-0.5 text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition"
                            >
                              Auto Fill
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="6-Digit OTP"
                            className="flex-1 px-3 py-2 text-center font-mono font-bold text-base tracking-widest bg-white rounded-lg border border-slate-300 focus:border-blue-600 outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpCode.length !== 6 || otpLoading}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            {otpLoading ? 'Verifying...' : 'Verify OTP'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Address & Location Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    3. Residential Address
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Village / Town / Gram Panchayat *
                    </label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      placeholder="e.g. Enter Your Village Name"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    >
                      {ODISHA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Postal Address (House No, Street, Landmark) *
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      placeholder="e.g. Enter Your Landmark"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PIN Code * (6 Digits)
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. Enter Your Pincode"
                      maxLength={6}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I solemnly declare that the particulars provided above are true and complete to the best of my knowledge. I abide by the constitution, bye-laws, and objectives of the <strong>Liberal Democratic Association (LDA – Laba Suna Organisation)</strong> and pledge to work peacefully towards community upliftment.{' '}
                    <button
                      type="button"
                      onClick={onOpenTerms}
                      className="text-blue-700 underline font-semibold hover:text-blue-900 ml-1 inline"
                    >
                      View Terms & Conditions
                    </button>
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onCheckStatusClick}
                  className="text-xs font-semibold text-blue-800 hover:text-blue-950 underline"
                >
                  Already registered? Check Application Status
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-blue-700/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting to LDA Database...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-amber-300" />
                      <span>Complete Online Registration</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
};
