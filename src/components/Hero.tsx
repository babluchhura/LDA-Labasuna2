import React from 'react';
import { UserPlus, Search, ArrowRight, ShieldCheck, HeartHandshake, Scale, Heart } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface HeroProps {
  onRegisterClick: () => void;
  onStatusClick: () => void;
  onFounderClick: () => void;
  onActivitiesClick: () => void;
  onDonateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRegisterClick,
  onStatusClick,
  onFounderClick,
  onActivitiesClick,
  onDonateClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative background geometry */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.18),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Mission, and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-tight">
                Liberal Democratic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">Association</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-blue-200 tracking-wide uppercase">
                LDA — Laba Suna Organisation
              </p>
            </div>

            {/* Subheading / Mission Narrative */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Founded by Advocate & Social Worker <strong className="text-white font-semibold">Laba Suna</strong> in Lathore, Odisha. LDA stands resolute in eradicating rural hardship through pro-bono legal advocacy, free healthcare camps, educational drives for underprivileged children, and grassroots community upliftment.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onDonateClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/40 transition flex items-center justify-center gap-2 group cursor-pointer animate-bounce"
              >
                <Heart className="w-5 h-5 text-amber-300 fill-amber-300 transition group-hover:scale-110" />
                <span>Donate Now (80G)</span>
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </button>

              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-amber-300 transition group-hover:scale-110" />
                <span>Join Our Organisation</span>
              </button>

              <button
                onClick={onStatusClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-100 font-semibold text-base transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>Check Status</span>
              </button>
            </div>

            {/* Highlight Trust Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Free Legal Aid</h4>
                  <p className="text-[11px] text-slate-400">Led by Adv. Laba Suna</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Community Relief</h4>
                  <p className="text-[11px] text-slate-400">Rations & Health Camps</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center text-sky-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Govt. Verified</h4>
                  <p className="text-[11px] text-slate-400">Transparent & Ethical</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder & Organisation Card Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Glow backdrop */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
              
              <div className="relative bg-gradient-to-b from-slate-900/90 to-blue-950/95 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                
                {/* Founder Photo & Quick Bio */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl group">
                    <img
                      src={BRAND_ASSETS.founder}
                      alt="Advocate Laba Suna"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent py-1 text-[10px] font-bold text-amber-300">
                      Advocate & Social Worker
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white font-serif">
                    Laba Suna
                  </h3>
                  <p className="text-xs text-blue-300 font-medium">
                    Founder & Advocate • LDA
                  </p>

                  {/* Impact Stats in Card */}
                  <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="block text-base font-extrabold text-amber-400">1,250+</span>
                      <span className="text-[10px] text-slate-400">Registered</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="block text-base font-extrabold text-sky-400">45+</span>
                      <span className="text-[10px] text-slate-400">Welfare Camps</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="block text-base font-extrabold text-emerald-400">100%</span>
                      <span className="text-[10px] text-slate-400">Pro-Bono Aid</span>
                    </div>
                  </div>

                  <button
                    onClick={onFounderClick}
                    className="mt-4 w-full py-2.5 rounded-lg bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 hover:text-white text-xs font-semibold border border-blue-700/60 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Full Founder Biography</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
