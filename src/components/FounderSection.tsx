import React from 'react';
import { Scale, HeartHandshake, MapPin, Award, BookOpen, Mail, Phone, ExternalLink, Quote, CheckCircle2, Facebook, Instagram, Twitter } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface FounderSectionProps {
  onJoinClick?: () => void;
  onContactClick?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onJoinClick, onContactClick }) => {
  return (
    <section id="founder" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Visionary Leadership
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Meet Our Founder: Advocate Laba Suna
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Advocate and Social Worker from Lathore, Odisha. Dedicated to community welfare, constitutional literacy, and uplifting the underprivileged.
          </p>
        </div>

        {/* Profile Card Container */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/50 rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            {/* Left Column: Founder Photo & Credentials */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-900/10">
                  <img
                    src={BRAND_ASSETS.founder}
                    alt="Advocate Laba Suna"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 inset-x-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-1.5 px-3 rounded-lg shadow-md text-center text-xs font-bold tracking-wide">
                  LDA Founder 
                </div>
              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900 font-serif">
                Laba Suna
              </h3>
              <p className="text-sm font-semibold text-blue-800">
                Founder & Advocate, Laba Suna 
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Lathore, Balangir, Odisha,</span>
              </div>

              {/* Social & Contact Buttons */}
              <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                <a
                  href={BRAND_ASSETS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 shadow-xs transition"
                  title="Facebook - Advocate Laba Suna"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={BRAND_ASSETS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-pink-600 hover:border-pink-600 shadow-xs transition"
                  title="Instagram - Advocate Laba Suna"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={BRAND_ASSETS.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-sky-500 hover:border-sky-500 shadow-xs transition"
                  title="Twitter / X - Advocate Laba Suna"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@lda-odisha.org"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 shadow-xs transition"
                  title="Email Advocate Laba Suna"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="tel:+919437812345"
                  className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 shadow-xs transition"
                  title="Official Helpline"
                  aria-label="Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919437812345?text=Namaste%20Advocate%20Laba%20Suna,%20I%20would%20like%20to%20connect%20regarding%20LDA%20social%20work."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-xs transition"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <span className="font-bold text-xs">WA</span>
                </a>
              </div>

              {/* Verified Identity Card */}
              <div className="mt-6 w-full p-4 rounded-xl bg-blue-900/5 border border-blue-200/60 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950 mb-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Key Commitments of Laba Suna</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>Free Legal Counseling for destitute rural villagers</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>Educational sponsorship for tribal girl students</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>Mobile medical camps & clean drinking water advocacy</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Full Biography and Philosophy */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Quote Banner */}
              <div className="relative p-5 rounded-2xl bg-blue-900 text-white shadow-lg overflow-hidden">
                <Quote className="absolute -right-2 -bottom-4 w-24 h-24 text-blue-800/40 pointer-events-none" />
                <p className="text-base sm:text-lg italic font-medium leading-relaxed">
                  "Justice is not a privilege reserved for courts of the wealthy; it is the fundamental birthright of every citizen in our remote villages. LDA exists to bridge this divide through legal defense, education, and compassionate humanitarian aid."
                </p>
                <div className="mt-3 text-xs font-bold text-amber-300">
                  — Advocate Laba Suna
                </div>
              </div>

              {/* Biographical Narrative */}
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>Laba Suna</strong> is an accomplished <strong>Advocate and Social Worker</strong> based in <strong>Lathore, Odisha</strong>. Deeply rooted in the socio-economic realities of Western Odisha, he has spent over a decade passionately working on the frontlines of grassroots legal empowerment, constitutional literacy, and public interest advocacy.
                </p>
                
                <p>
                  Witnessing the struggles of underprivileged tribal communities, landless farmers, and disadvantaged families who frequently lacked basic knowledge of their statutory rights or administrative remedies, he established the <strong>LDA (Liberal Democratic Association – Laba Suna Organisation)</strong> as an institutional platform to mobilize youth, professionals, and community elders for collective socio-economic transformation.
                </p>

                <p>
                  Under his stewardship, LDA has successfully organised free health camps across Nuapada and Balangir border areas, distributed textbooks and uniforms to hundreds of rural schoolchildren, facilitated government welfare entitlement access, and resolved numerous civil and land disputes for indigent families completely pro-bono.
                </p>
              </div>

              {/* Pillars of Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Legal Aid & Human Rights</h4>
                    <p className="text-[11px] text-slate-500">Protection against exploitation</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rural Education Wings</h4>
                    <p className="text-[11px] text-slate-500">School enrollment & study kits</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {onJoinClick && (
                  <button
                    onClick={onJoinClick}
                    className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    Register as Member Under LDA
                  </button>
                )}
                {onContactClick && (
                  <button
                    onClick={onContactClick}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-300 transition cursor-pointer"
                  >
                    Contact Founder Office
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
