import React, { useState } from 'react';
import { Menu, X, Shield, ChevronRight, UserPlus, Search, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onDonateClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isAdminLoggedIn,
  onOpenAdmin,
  onDonateClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'founder', label: 'Founder Profile' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'activities', label: 'Our Activities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'news', label: 'News & Events' },
    { id: 'register', label: 'Online Registration', highlight: true },
    { id: 'status', label: 'Check Status' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-900 shadow-md transition group-hover:scale-105">
              <img
                src="https://s15.gifyu.com/images/bWJWy.png"
                alt="LDA Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-blue-950 font-serif">
                  LDA
                </span>
                <span className="text-xs bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Odisha
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-blue-900 tracking-wide">
                Liberal Democratic Association
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`ml-2 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 shadow-sm ${
                      isActive
                        ? 'bg-blue-800 text-white ring-2 ring-blue-500'
                        : 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-blue-500/20'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>{link.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    isActive
                      ? 'text-blue-900 bg-blue-50 border border-blue-200'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-200">
              <a
                href={BRAND_ASSETS.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                title="LDA Facebook Page"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BRAND_ASSETS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition"
                title="LDA Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND_ASSETS.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-slate-500 hover:text-sky-500 hover:bg-slate-100 transition"
                title="LDA Twitter / X"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onOpenAdmin}
              className="ml-1 p-2 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-100 transition cursor-pointer"
              title={isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            >
              <Shield className="w-4 h-4 text-slate-500 hover:text-amber-600" />
            </button>

            <button
              onClick={onDonateClick}
              className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Donate Now</span>
            </button>
          </nav>

          {/* Tablet Quick Action Buttons */}
          <div className="hidden lg:flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('status')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-800 flex items-center gap-1 bg-slate-100 rounded-md"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Status</span>
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md flex items-center gap-1 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join LDA</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('register')}
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-blue-700 rounded-md shadow-xs flex items-center gap-1"
            >
              <span>Join</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-900 hover:bg-slate-100 transition focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDonateClick();
              }}
              className="w-full mb-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Donate Now & Get 80G Receipt</span>
            </button>

            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-left transition ${
                    link.highlight
                      ? 'bg-blue-700 text-white'
                      : isActive
                      ? 'bg-blue-50 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <UserPlus className="w-4 h-4 text-amber-300" />}
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
            {/* Mobile Social Links */}
            <div className="pt-3 mt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Follow LDA Online
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={BRAND_ASSETS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
                <a
                  href={BRAND_ASSETS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={BRAND_ASSETS.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  aria-label="Twitter"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Authorised Personnel</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
