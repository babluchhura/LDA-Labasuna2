import React from 'react';
import { MapPin, Phone, Mail, Shield, Heart, ArrowUp, UserPlus, Search, Facebook, Instagram, Twitter } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface FooterProps {
  onNavClick: (page: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavClick,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Brand & Founder Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md">
                <img src="https://s15.gifyu.com/images/bWJWy.png" alt="LDA Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white tracking-wide">
                  Liberal Democratic Association
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                 • Lathore, Odisha
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Founded and guided by Advocate & Social Worker <strong>Laba Suna</strong>. LDA is dedicated to pro-bono legal advocacy, human rights awareness, rural education kits, and community development across Western Odisha.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="bg-blue-900/60 text-blue-200 border border-blue-700/60 px-2.5 py-1 rounded-md text-[11px] font-medium">
                Registered Non-Governmental Welfare Organisation
              </span>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={BRAND_ASSETS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition shadow-sm group"
                  title="Follow LDA on Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href={BRAND_ASSETS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-rose-400 transition shadow-sm group"
                  title="Follow LDA on Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href={BRAND_ASSETS.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 hover:border-sky-400 transition shadow-sm group"
                  title="Follow LDA on Twitter / X"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Organisation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('home')} className="hover:text-blue-400 transition cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('about')} className="hover:text-blue-400 transition cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('founder')} className="hover:text-blue-400 transition cursor-pointer">
                  Founder Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('mission')} className="hover:text-blue-400 transition cursor-pointer">
                  Mission & Vision
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('activities')} className="hover:text-blue-400 transition cursor-pointer">
                  Social Work Activities
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Membership & Media */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Membership
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('register')} className="text-amber-300 hover:text-amber-200 font-bold transition flex items-center gap-1 cursor-pointer">
                  <UserPlus className="w-3 h-3" />
                  <span>Online Registration</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('status')} className="hover:text-blue-400 transition flex items-center gap-1 cursor-pointer">
                  <Search className="w-3 h-3" />
                  <span>Check Status</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('gallery')} className="hover:text-blue-400 transition cursor-pointer">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('news')} className="hover:text-blue-400 transition cursor-pointer">
                  News & Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('contact')} className="hover:text-blue-400 transition cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Secretariat */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Central Secretariat
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>LDA Office, Lathore, Balangir, Odisha — 766028,</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 94378 12345 / 82800 67890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>contact@lda-odisha.org</span>
              </p>
            </div>
            
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-white hover:border-slate-700 transition"
                title="Authorised personnel login"
              >
                <Shield className="w-3 h-3 text-amber-500" />
                <span>Admin Login Panel</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} LDA Liberal Democratic Association All Rights Reserved Designer By - Yogesh Chhura
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 underline cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-slate-300 underline cursor-pointer">
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
