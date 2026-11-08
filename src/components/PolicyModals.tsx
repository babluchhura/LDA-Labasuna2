import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface PolicyModalsProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl overflow-y-auto max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <Shield className="w-5 h-5 text-blue-700" />
            ) : (
              <FileText className="w-5 h-5 text-amber-600" />
            )}
            <h3 className="text-xl font-bold font-serif text-slate-900">
              {type === 'privacy' ? 'LDA Privacy & Data Protection Policy' : 'LDA Constitution & Terms of Membership'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Liberal Democratic Association (LDA – Laba Suna Organisation)</strong> is dedicated to upholding the highest standards of data integrity and digital privacy for our registered members, volunteers, and citizens seeking legal aid or humanitarian support.
              </p>
              <h4 className="font-bold text-slate-900">1. Information Collection</h4>
              <p>
                We collect personal information solely via official website forms (including Full Name, Contact Details, Residential Address, Date of Birth, and Profile Photograph) for verifying applicant identity, granting membership recognition, and managing social work coordination in Odisha.
              </p>
              <h4 className="font-bold text-slate-900">2. Non-Commercial Use</h4>
              <p>
                LDA never sells, leases, or trades member information to third-party marketing entities. Information is restricted exclusively to authorized governing council executives led by Founder Advocate Laba Suna.
              </p>
              <h4 className="font-bold text-slate-900">3. Legal Protection</h4>
              <p>
                Citizens seeking free legal counseling are protected under client-advocate confidentiality in accordance with the Advocates Act and Bar Council of India guidelines.
              </p>
            </>
          ) : (
            <>
              <p>
                By enrolling as an online registered member of <strong>LDA (Liberal Democratic Association – Laba Suna Organisation)</strong>, you consent to adhere to the following democratic bye-laws:
              </p>
              <h4 className="font-bold text-slate-900">1. Core Objectives</h4>
              <p>
                Every member pledges to foster communal harmony, secular unity, rural education, and social justice throughout Lathore, Nuapada, Balangir, and the state of Odisha without discrimination on caste, creed, or gender lines.
              </p>
              <h4 className="font-bold text-slate-900">2. Code of Conduct</h4>
              <p>
                Members must act peacefully, uphold constitutional values, and never utilize the name or emblem of LDA for personal financial extortion or unlawful activities.
              </p>
              <h4 className="font-bold text-slate-900">3. Membership Status & Revocation</h4>
              <p>
                All online submissions are subject to committee verification. The Governing Council reserves the statutory right to approve, reject, or revoke membership in cases of disciplinary misconduct or false declarations.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-800 text-white font-bold text-xs hover:bg-blue-900 cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
