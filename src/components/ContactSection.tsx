import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await apiService.submitContact(formData);
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
      } else {
        setErrorMessage(res.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while contacting LDA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Reach Out To Us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Contact LDA Head Office
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Have a question about membership, need free legal aid counseling, or wish to report a community issue in Odisha? Send us a direct message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Office Details & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-white">
                    Liberal Democratic Association
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mt-1">
                    Laba Suna Organisation • Central Secretariat
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-800/80 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Official Headquarters</span>
                      <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                        LDA Central Office, Main Road, Lathore,<br />
                        Nuapada / Balangir Region, Odisha — 766028, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-800/80 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Helpline & WhatsApp</span>
                      <p className="text-slate-300 text-xs mt-0.5">
                        +91 94378 12345 / +91 82800 67890
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-800/80 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Official Email</span>
                      <p className="text-slate-300 text-xs mt-0.5">
                        contact@lda-odisha.org / labasuna.advocate@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-800/80 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Working Hours</span>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Monday – Saturday: 9:00 AM – 7:00 PM IST<br />
                        (Emergency Legal Aid 24x7)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-900/80 space-y-3">
                  <a
                    href="https://wa.me/919437812345?text=Hello%20LDA%20Odisha%20Office,%20I%20want%20to%20connect%20with%20Advocate%20Laba%20Suna."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect on WhatsApp Helpline</span>
                  </a>

                  <div>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2 text-center sm:text-left">
                      Follow On Social Media
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={BRAND_ASSETS.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-900/80 hover:bg-blue-600 border border-blue-700/60 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs group"
                        title="Facebook"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Facebook</span>
                      </a>
                      <a
                        href={BRAND_ASSETS.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-900/80 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 border border-blue-700/60 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs group"
                        title="Instagram"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Instagram</span>
                      </a>
                      <a
                        href={BRAND_ASSETS.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-900/80 hover:bg-sky-500 border border-blue-700/60 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs group"
                        title="Twitter / X"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Twitter</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Send an Enquiry or Petition
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Messages are securely stored in the LDA database and trigger an immediate notification to the Admin.
            </p>

            {success ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 font-serif">Message Dispatched!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for contacting the Liberal Democratic Association. Your enquiry has been received and logged into the Admin system. We will reach back via phone or email promptly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-3 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Your Name"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="e.g. Your Mobile Number"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Free Legal Aid / Health Camp Request"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Query *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your enquiry, assistance required, or partnership proposal..."
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/50"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending to Admin...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
