import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Copy,
  Check,
  Building,
  ArrowRight,
  ArrowLeft,
  Printer,
  Share2,
  Lock,
  Sparkles,
  FileText
} from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Donation } from '../types.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCause?: string;
}

const CAUSES = [
  {
    id: 'legal-aid',
    title: 'Free Legal Aid for Destitute & Poor',
    desc: 'Pro-bono court defense, bail petitions, and human rights advocacy for indigent villagers.',
    icon: '⚖️',
  },
  {
    id: 'education',
    title: 'Tribal Children Education Kits & Books',
    desc: 'School uniforms, bags, stationery, and scholarship sponsorships for underprivileged students.',
    icon: '📚',
  },
  {
    id: 'health',
    title: 'Rural Healthcare & Free Medicine Camps',
    desc: 'Mobile clinics, diabetes & eye checkups, and lifesaving medicines in remote Odisha villages.',
    icon: '🩺',
  },
  {
    id: 'food-relief',
    title: 'Poor & Destitute Humanitarian Relief',
    desc: 'Dry ration kits, blankets, clean drinking water filters, and emergency disaster relief.',
    icon: '🍲',
  },
  {
    id: 'general-welfare',
    title: 'General LDA Community Welfare Fund',
    desc: 'Empowering grassroots social work, community centers, and youth skill workshops.',
    icon: '🏛️',
  },
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, preselectedCause }) => {
  const [step, setStep] = useState<'otp-verify' | 'details' | 'payment' | 'receipt'>('otp-verify');

  // Step 1: Donor & OTP State
  const [mobileNumber, setMobileNumber] = useState('');
  const [donorName, setDonorName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDispatchedMessage, setOtpDispatchedMessage] = useState('');
  const [simulationOtp, setSimulationOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // Step 2: Cause, Amount & Tax Details
  const [selectedCause, setSelectedCause] = useState(preselectedCause || CAUSES[0].title);
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
  const [transactionUtr, setTransactionUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Step 4: Completed Donation Receipt
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // Clean mobile helper
  const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);

  // 1. Request OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!donorName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.sendDonationOtp(cleanMobile, donorName.trim());
      if (res.success) {
        setOtpSent(true);
        setOtpDispatchedMessage(res.message || `OTP dispatched to +91 ${cleanMobile}`);
        if (res.simulationOtp) {
          setSimulationOtp(res.simulationOtp);
        }
        setCountdown(60);
      } else {
        setErrorMessage(res.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.verifyDonationOtp(cleanMobile, otpCode.trim());
      if (res.success && res.verificationToken) {
        setIsVerified(true);
        setVerificationToken(res.verificationToken);
        setStep('details');
      } else {
        setErrorMessage(res.error || 'Invalid OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Amount Selection
  const activeAmount = customAmount ? Math.max(1, parseInt(customAmount) || 0) : amount;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (activeAmount < 10) {
      setErrorMessage('Minimum donation amount is ₹10');
      return;
    }
    setStep('payment');
  };

  // 3. Complete Donation & Generate Receipt
  const handleCompleteDonation = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        donorName: donorName.trim(),
        mobileNumber: cleanMobile,
        email: email.trim() || undefined,
        panNumber: panNumber.trim() || undefined,
        address: address.trim() || undefined,
        cause: selectedCause,
        amount: activeAmount,
        paymentMethod,
        transactionUtr: transactionUtr.trim() || `UPI-TXN-${Date.now().toString().slice(-8)}`,
        verificationToken,
      };

      const res = await apiService.createDonation(payload);
      if (res.success && res.donation) {
        setCompletedDonation(res.donation);
        setStep('receipt');
      } else {
        setErrorMessage(res.error || 'Failed to confirm donation. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while confirming donation');
    } finally {
      setLoading(false);
    }
  };

  // Copy helpers
  const copyUpiId = () => {
    navigator.clipboard.writeText('labasuna.advocate@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const copyBankDetails = () => {
    const text = `Account Name: Liberal Democratic Association\nBank: State Bank of India\nBranch: Lathore Branch\nA/C No: 38947291038\nIFSC: SBIN0012056`;
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!completedDonation) return;
    const text = `Namaste! I have supported LDA (Liberal Democratic Association - Laba Suna Organisation) with a donation of ₹${completedDonation.amount.toLocaleString('en-IN')} for "${completedDonation.cause}". Official Receipt: ${completedDonation.receiptNumber}. You can also support: https://lda-odisha.org`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Dynamic UPI payment URL
  const upiUrl = `upi://pay?pa=labasuna.advocate@okaxis&pn=Liberal%20Democratic%20Association&am=${activeAmount}&cu=INR&tn=LDA%20Donation%20${encodeURIComponent(selectedCause.slice(0, 20))}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white p-0.5 shadow-md shrink-0">
              <img src="https://s15.gifyu.com/images/bWJWy.png" alt="LDA" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-serif text-white tracking-wide">
                  Online Donation
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                   
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Liberal Democratic Association
              </p>
            </div>
          </div>

          {/* Stepper progress bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
            <div className={`py-1.5 rounded-lg transition ${step === 'otp-verify' ? 'bg-amber-400 text-slate-950 shadow-sm' : isVerified ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300'}`}>
              1. Mobile OTP
            </div>
            <div className={`py-1.5 rounded-lg transition ${step === 'details' ? 'bg-amber-400 text-slate-950 shadow-sm' : step === 'payment' || step === 'receipt' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300'}`}>
              2. Cause & Amount
            </div>
            <div className={`py-1.5 rounded-lg transition ${step === 'payment' || step === 'receipt' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/10 text-slate-300'}`}>
              3. Payment & Receipt
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: MOBILE NUMBER & REAL OTP VERIFICATION */}
          {/* ======================================================== */}
          {step === 'otp-verify' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center mb-2 shadow-xs border border-blue-100">
                  <ShieldCheck className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                 Mobile OTP Verification
                </h3>
                <p className="text-xs text-slate-500">
                  As requested, authentic mobile number registration with real OTP verification is required before initiating a donation.
                </p>
              </div>

              {!otpSent ? (
                /* Step 1A: Enter Name and Mobile Number */
                <form onSubmit={handleSendOtp} className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Donor Full Name *
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      placeholder="e.g. Enter Your Full Name"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="Enter Your Mobile Number"
                        className="w-full pl-13 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono text-slate-900 font-semibold"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      A real 6-digit OTP code will be generated and dispatched immediately to this mobile.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cleanMobile.length !== 10 || !donorName.trim()}
                    className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating & Dispatching OTP...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 text-amber-300" />
                        <span>Send Real Verification OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 1B: Enter 6-digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-5 max-w-md mx-auto">
                  
                  {/* Real OTP Dispatch Notice Card */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>OTP Dispatched</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        +91 {cleanMobile}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {otpDispatchedMessage}
                    </p>
                    
                    {/* Live SMS Verification Alert */}
                    {simulationOtp && (
                      <div className="p-3 bg-white rounded-xl border border-blue-300 shadow-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Direct SMS Code (Live Verification)
                          </span>
                          <span className="text-lg font-mono font-black text-blue-900 tracking-widest">
                            {simulationOtp}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpCode(simulationOtp)}
                          className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition"
                        >
                          Auto Fill
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 rounded-xl border-2 border-blue-600 focus:ring-4 focus:ring-blue-100 outline-hidden bg-slate-50 text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      disabled={countdown > 0 || loading}
                      onClick={() => handleSendOtp()}
                      className="text-blue-700 hover:text-blue-900 font-semibold disabled:text-slate-400 cursor-pointer"
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-slate-500 hover:text-slate-700 underline text-xs cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Verify & Proceed to Donate</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CAUSE, AMOUNT & TAX DETAILS */}
          {/* ======================================================== */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Verified Donor Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Verified Donor: <strong>{donorName}</strong> (+91 {cleanMobile})
                  </span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

              {/* 1. Choose Cause */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Donation Cause *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CAUSES.map((c) => {
                    const isSelected = selectedCause === c.title;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCause(c.title)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{c.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {c.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                              {c.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Choose Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Donation Amount (INR) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = !customAmount && amount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-800 text-white border-blue-800 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Or enter custom amount in Rupees (e.g. 5000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-semibold"
                  />
                </div>
              </div>

              {/* 3. Optional 80G Tax Exemption Details */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Receipt & 80G Tax Exemption Details (Optional)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Receipt sent via Email & SMS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (for e-receipt)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="PAN Number (for 80G tax benefit)"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Residential Address / City / Village"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('otp-verify')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Pay ₹{activeAmount.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 3: REAL PAYMENT GATEWAY (UPI QR & BANK TRANSFER) */}
          {/* ======================================================== */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Summary Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-200 block">
                    Donation Amount to Contribute
                  </span>
                  <span className="text-2xl font-black font-serif text-amber-300">
                    ₹{activeAmount.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    For: {selectedCause}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-blue-200 block">Verified Donor</span>
                  <span className="font-bold text-white">{donorName}</span>
                  <span className="block text-[11px] font-mono text-amber-300">+91 {cleanMobile}</span>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-700" />
                  <span>Instant UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>Direct Bank NEFT / IMPS</span>
                </button>
              </div>

              {/* Option A: UPI & QR Code */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col sm:flex-row items-center gap-6 justify-center">
                    
                    {/* QR Code */}
                    <div className="w-44 h-44 rounded-2xl bg-white p-2.5 border-2 border-blue-900 shadow-md shrink-0 flex flex-col items-center justify-center">
                      <img
                        src="https://s15.gifyu.com/images/bWPZx.jpg"
                        alt="LDA Donation UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* UPI Info & Apps */}
                    <div className="text-left space-y-3 max-w-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Official Organisation UPI ID
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs sm:text-sm font-mono font-bold text-blue-950 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                            9668612323-2@axl
                          </code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Scan using <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or any UPI app to donate ₹{activeAmount.toLocaleString('en-IN')}.
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <a
                          href={upiUrl}
                          className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] transition"
                        >
                          Open in UPI App
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Option B: Direct Bank Transfer */}
              {paymentMethod === 'BANK_TRANSFER' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Official Organisation Bank Account
                    </span>
                    <button
                      type="button"
                      onClick={copyBankDetails}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Copied' : 'Copy Bank Details'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Account Name</span>
                      <strong className="text-slate-900">Liberal Democratic Association</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Bank Name</span>
                      <strong className="text-slate-900">State Bank of India (SBI)</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Account Number</span>
                      <strong className="text-slate-900 font-mono text-sm">38947291038</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">IFSC Code</span>
                      <strong className="text-slate-900 font-mono text-sm">SBIN0012056</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[11px]">Branch</span>
                      <strong className="text-slate-900">Lathore Branch, Balangir, Odisha</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Confirmation: Enter UTR / Ref Number */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    UPI Transaction ID / UTR Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionUtr}
                    onChange={(e) => setTransactionUtr(e.target.value)}
                    placeholder="e.g. 431089201948 or UPI Ref"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter the 12-digit UTR from your bank or UPI receipt for instant reconciliation.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleCompleteDonation}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Issuing Receipt...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Confirm Payment & Download 80G Receipt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: OFFICIAL 80G DONATION RECEIPT & CERTIFICATE */}
          {/* ======================================================== */}
          {step === 'receipt' && completedDonation && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  Donation Received Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  Thank you for your noble contribution to LDA. Your official 80G donation certificate is issued below.
                </p>
              </div>

              {/* Printable Official Receipt Certificate Card */}
              <div id="printable-receipt" className="p-6 sm:p-8 rounded-3xl bg-amber-50/40 border-2 border-amber-300 shadow-lg text-slate-900 space-y-5 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[60px] font-serif font-black text-amber-200/20 select-none pointer-events-none">
                  LDA
                </div>

                {/* Receipt Header */}
                <div className="flex items-center justify-between border-b border-amber-200 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="https://s15.gifyu.com/images/bWJWy.png" alt="LDA" className="w-12 h-12 rounded-full border border-amber-500" />
                    <div>
                      <h4 className="text-base font-bold font-serif text-blue-950">
                        Liberal Democratic Association
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">
                        Laba Suna Organisation • Lathore, Odisha
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Non-Governmental Social Welfare Organisation
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Receipt No.
                    </span>
                    <strong className="text-xs sm:text-sm font-mono text-blue-900">
                      {completedDonation.receiptNumber}
                    </strong>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {new Date(completedDonation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Receipt Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Donor Name:</span>
                    <strong className="text-slate-900 font-serif text-sm">{completedDonation.donorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Verified Mobile:</span>
                    <strong className="text-slate-900 font-mono">+91 {completedDonation.mobileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Contribution Cause:</span>
                    <span className="text-slate-800 font-semibold">{completedDonation.cause}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Payment Method & UTR:</span>
                    <span className="text-slate-800 font-mono text-[11px]">{completedDonation.paymentMethod} • {completedDonation.transactionUtr || 'VERIFIED'}</span>
                  </div>
                  {completedDonation.panNumber && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Donor PAN Number:</span>
                      <strong className="text-slate-900 font-mono">{completedDonation.panNumber}</strong>
                    </div>
                  )}
                  {completedDonation.email && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Donor Email:</span>
                      <span className="text-slate-800">{completedDonation.email}</span>
                    </div>
                  )}
                </div>

                {/* Amount Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-200 block">
                      Total Donated Amount
                    </span>
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      ₹{completedDonation.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Payment Verified
                  </span>
                </div>

                {/* Founder Signature & Seal */}
                <div className="flex items-end justify-between pt-3 border-t border-amber-200 text-xs">
                  <div className="text-[10px] text-slate-500 max-w-xs">
                    * Donations to Liberal Democratic Association support humanitarian, legal aid, and tribal education programs in Odisha.
                  </div>
                  <div className="text-center">
                    <div className="font-serif italic text-blue-900 text-sm font-bold">
                      Laba Suna
                    </div>
                    <div className="w-24 h-0.5 bg-slate-400 mx-auto my-0.5" />
                    <span className="text-[10px] text-slate-600 font-semibold block">
                      Advocate Laba Suna
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      Founder Of LDA
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save 80G Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
