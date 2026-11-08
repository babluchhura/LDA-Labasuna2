/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FounderSection } from './components/FounderSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ActivitiesSection } from './components/ActivitiesSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { NewsSection } from './components/NewsSection.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { StatusChecker } from './components/StatusChecker.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { PolicyModals } from './components/PolicyModals.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { DonationModal } from './components/DonationModal.tsx';
import { apiService, authStorage } from './services/api.ts';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check existing Admin session
    checkAdminSession();

    // 2. Increment visitor hit
    apiService.recordVisitor();

    // 3. Handle initial URL hash
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        if (['home', 'about', 'founder', 'mission', 'activities', 'gallery', 'news', 'register', 'status', 'contact', 'admin'].includes(hash)) {
          if (hash === 'admin') {
            setActivePage(authStorage.getToken() ? 'admin-dashboard' : 'admin-login');
          } else {
            setActivePage(hash);
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const checkAdminSession = async () => {
    const isAuth = await apiService.checkAdminAuth();
    setIsAdminLoggedIn(isAuth);
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setActivePage('admin-dashboard');
    } else {
      setActivePage('admin-login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setActivePage('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = async () => {
    await apiService.adminLogout();
    setIsAdminLoggedIn(false);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin Dashboard exclusively when requested and authenticated
  if (activePage === 'admin-dashboard') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToHome={() => handleNavigate('home')}
        />
      );
    }
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onGoToSite={() => handleNavigate('home')}
      />
    );
  }

  // Render Admin Login
  if (activePage === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToHome={() => handleNavigate('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Sticky Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={handleOpenAdmin}
        onDonateClick={() => setIsDonationModalOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero
              onRegisterClick={() => handleNavigate('register')}
              onStatusClick={() => handleNavigate('status')}
              onFounderClick={() => handleNavigate('founder')}
              onActivitiesClick={() => handleNavigate('activities')}
              onDonateClick={() => setIsDonationModalOpen(true)}
            />
            <FounderSection
              onJoinClick={() => handleNavigate('register')}
              onContactClick={() => handleNavigate('contact')}
            />
            <AboutSection />
            <ActivitiesSection
              onJoinClick={() => handleNavigate('register')}
              onGalleryClick={() => handleNavigate('gallery')}
            />
            <RegistrationForm
              onCheckStatusClick={() => handleNavigate('status')}
              onOpenTerms={() => setPolicyModal('terms')}
            />
            <StatusChecker
              onRegisterClick={() => handleNavigate('register')}
              onContactClick={() => handleNavigate('contact')}
            />
            <GallerySection />
            <NewsSection />
            <ContactSection />
          </>
        )}

        {activePage === 'about' && (
          <div className="pt-4">
            <AboutSection />
            <ActivitiesSection
              onJoinClick={() => handleNavigate('register')}
              onGalleryClick={() => handleNavigate('gallery')}
            />
          </div>
        )}

        {activePage === 'founder' && (
          <div className="pt-4">
            <FounderSection
              onJoinClick={() => handleNavigate('register')}
              onContactClick={() => handleNavigate('contact')}
            />
          </div>
        )}

        {activePage === 'mission' && (
          <div className="pt-4">
            <AboutSection />
          </div>
        )}

        {activePage === 'activities' && (
          <div className="pt-4">
            <ActivitiesSection
              onJoinClick={() => handleNavigate('register')}
              onGalleryClick={() => handleNavigate('gallery')}
            />
          </div>
        )}

        {activePage === 'gallery' && (
          <div className="pt-4">
            <GallerySection />
          </div>
        )}

        {activePage === 'news' && (
          <div className="pt-4">
            <NewsSection />
          </div>
        )}

        {activePage === 'register' && (
          <div className="pt-4">
            <RegistrationForm
              onCheckStatusClick={() => handleNavigate('status')}
              onOpenTerms={() => setPolicyModal('terms')}
            />
          </div>
        )}

        {activePage === 'status' && (
          <div className="pt-4">
            <StatusChecker
              onRegisterClick={() => handleNavigate('register')}
              onContactClick={() => handleNavigate('contact')}
            />
          </div>
        )}

        {activePage === 'contact' && (
          <div className="pt-4">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={handleNavigate}
        onOpenPrivacy={() => setPolicyModal('privacy')}
        onOpenTerms={() => setPolicyModal('terms')}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating WhatsApp Help Button */}
      <WhatsAppButton />

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />

      {/* Privacy & Terms Modals */}
      <PolicyModals
        type={policyModal}
        onClose={() => setPolicyModal(null)}
      />

    </div>
  );
}
