import React from 'react';
import { Target, Eye, Compass, ShieldCheck, HeartHandshake, Users, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            About Our Organisation
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Liberal Democratic Association
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            LDA is a premier social welfare and non-profit community organisation centered in Lathore, Odisha, working to build an egalitarian, just, and self-reliant society.
          </p>
        </div>

        {/* 3 Pillars: Who We Are, Mission, Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Who We Are */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Our Genesis & Identity
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Founded under the legal and social leadership of Advocate <strong>Laba Suna</strong>, LDA was born to give a collective, structured voice to rural inhabitants of Lathore and the wider Western Odisha region. We operate with strict adherence to democratic values, secular brotherhood, and constitutional ethics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Independent & Democratic Governance</span>
            </div>
          </div>

          {/* Card 2: Our Mission */}
          <div className="bg-white rounded-2xl p-8 border border-blue-200/80 shadow-md hover:shadow-lg transition relative flex flex-col justify-between ring-2 ring-blue-500/20">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-800 text-white flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Our Mission
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To guarantee basic socio-legal protection, quality primary education, preventive healthcare, and sustainable livelihood support to the poorest and most marginalized families in rural Odisha, eliminating poverty and injustice at the root.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Direct Action at Village Level</span>
            </div>
          </div>

          {/* Card 3: Our Vision */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Our Vision
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A progressive Odisha where every citizen—regardless of caste, economic status, or geographic isolation—enjoys equal constitutional rights, dignified employment, healthcare access, and an environment of peace, unity, and mutual respect.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>Inclusive Prosperity For All</span>
            </div>
          </div>

        </div>

        {/* Core Principles Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="border-b md:border-b-0 md:border-r border-blue-800/80 pb-4 md:pb-0 md:pr-6">
              <h4 className="text-lg font-bold font-serif text-amber-300">Constitutional Equality</h4>
              <p className="mt-1 text-xs text-blue-100">Every member and villager receives equal respect, unbiased protection, and equal access to advocacy.</p>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-blue-800/80 pb-4 md:pb-0 md:pr-6">
              <h4 className="text-lg font-bold font-serif text-amber-300">Absolute Transparency</h4>
              <p className="mt-1 text-xs text-blue-100">All member records, donations, and welfare disbursements are audited with complete accountability.</p>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-blue-800/80 pb-4 md:pb-0 md:pr-6">
              <h4 className="text-lg font-bold font-serif text-amber-300">Grassroots Engagement</h4>
              <p className="mt-1 text-xs text-blue-100">Programmes are designed by listening to rural youth, village elders, and self-help group leaders.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold font-serif text-amber-300">Volunteer Spirit</h4>
              <p className="mt-1 text-xs text-blue-100">Over 1,200 committed volunteers and advocates working wholeheartedly for community betterment.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
