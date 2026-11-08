import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, XCircle, Printer, Download, RefreshCw, User, MapPin, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Member } from '../types.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface StatusCheckerProps {
  onRegisterClick: () => void;
  onContactClick: () => void;
}

export const StatusChecker: React.FC<StatusCheckerProps> = ({
  onRegisterClick,
  onContactClick,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Member[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setResults(null);

    try {
      const data = await apiService.checkStatus(query.trim());
      if (data.members && data.members.length > 0) {
        setResults(data.members);
      } else {
        setErrorMessage(data.error || 'No record found with the provided details. Please check the Registration ID or Mobile Number.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to query registration status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="status" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Self-Service Member Portal
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Check Registration Status
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Enter your <strong>Unique Registration ID</strong> (e.g. <code>LDA-2026-XXXXX</code>) or your registered <strong>10-digit Mobile Number</strong> to view your membership approval status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Registration ID (e.g. LDA-2026-89412) or Mobile No"
                required
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white shadow-xs font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {results && results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.map((member) => {
              const isApproved = member.status === 'APPROVED';
              const isPending = member.status === 'PENDING';
              const isRejected = member.status === 'REJECTED';

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200"
                >
                  {/* Status Strip Header */}
                  <div
                    className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white ${
                      isApproved
                        ? 'bg-gradient-to-r from-emerald-800 to-teal-800'
                        : isPending
                        ? 'bg-gradient-to-r from-blue-900 to-indigo-900'
                        : 'bg-gradient-to-r from-rose-900 to-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isApproved && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                      {isPending && <Clock className="w-5 h-5 text-amber-300 animate-pulse" />}
                      {isRejected && <XCircle className="w-5 h-5 text-rose-300" />}
                      <span className="font-bold text-sm">
                        Application Status:{' '}
                        <span className="uppercase tracking-wider underline">
                          {member.status}
                        </span>
                      </span>
                    </div>
                    <div className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      ID: {member.registrationId}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      
                      {/* Photo or Avatar */}
                      <div className="sm:col-span-3 flex flex-col items-center">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center shadow-xs">
                          {member.profilePhotoUrl ? (
                            <img
                              src={member.profilePhotoUrl}
                              alt={member.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-slate-400" />
                          )}
                        </div>
                        <span className="mt-2 text-xs font-semibold text-slate-500">
                          {member.occupation}
                        </span>
                      </div>

                      {/* Bio Details */}
                      <div className="sm:col-span-9 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 font-serif">
                            {member.fullName}
                          </h3>
                          <p className="text-xs text-slate-500">
                            S/o or D/o {member.fatherName}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block font-semibold">Location</span>
                            <span className="text-slate-800 font-medium">{member.village}, {member.district}, {member.state}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">Application Date</span>
                            <span className="text-slate-800 font-medium">
                              {new Date(member.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Council Remarks */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-bold text-slate-700 block mb-0.5">Governing Committee Note:</span>
                          <p className="text-slate-600 italic">
                            {member.remarks || 'Your application is progressing normally through the verification stage.'}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* If Approved, show Official Card Action */}
                    {isApproved && (
                      <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Membership Confirmed • Authorized by Advocate Laba Suna</span>
                        </div>
                        <button
                          onClick={handlePrint}
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-400" />
                          <span>Print Digital Membership Card</span>
                        </button>
                      </div>
                    )}

                    {isPending && (
                      <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <span>Application under standard verification. Generally approved within 24–48 hours.</span>
                        <button
                          onClick={onContactClick}
                          className="text-blue-700 hover:text-blue-900 font-semibold underline"
                        >
                          Need urgent assistance? Contact Desk
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA for non-members */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Not yet registered with LDA?{' '}
          <button
            onClick={onRegisterClick}
            className="text-blue-800 font-bold hover:underline inline-flex items-center gap-1 ml-1 cursor-pointer"
          >
            <span>Register Online Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </section>
  );
};
