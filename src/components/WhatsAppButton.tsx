import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '919437812345';
  const defaultText = encodeURIComponent(
    'Namaste LDA Organisation! I would like to enquire about membership registration and social welfare activities in Lathore, Odisha.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultText}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition duration-200 group border-2 border-white/80"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        WhatsApp Helpline
      </span>
    </a>
  );
};
