import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, RefreshCw, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('labasuna@00');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const data = await apiService.adminLogin(username.trim(), password);
      if (data.success && data.token) {
        onLoginSuccess();
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.forgotPassword(username.trim());
      setForgotMessage(res.message || 'Password reset request dispatched to LDA Admin Console.');
    } catch (err: any) {
      setForgotMessage('Request submitted to security officer.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.4),transparent_60%)] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Top return button */}
        <div>
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
        </div>

        {/* Card Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
              <img
                src="https://s15.gifyu.com/images/bWJyZ.png"
                alt="LDA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold border border-blue-700/60">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Restricted Security Area</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
              LDA Admin Login
            </h2>
            <p className="text-xs text-slate-400">
              Liberal Democratic Association 
            </p>
          </div>

          {errorMessage && (
            <div className="mt-6 p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter secure password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-700/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>Authenticate & Open Dashboard</span>
                </>
              )}
            </button>

            {/* Security note */}
            <div className="pt-2 text-center text-[10px] text-slate-500">
              Protected by session encryption & multi-attempt rate limiting. All access is logged to the audit trail.
            </div>

          </form>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white space-y-4">
            <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Admin Password Recovery</span>
            </h3>

            {forgotMessage ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 text-xs">
                {forgotMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered Admin username. A security alert will be recorded on the server to reset your key.
                </p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Request Reset Alert
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotMessage('');
              }}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
