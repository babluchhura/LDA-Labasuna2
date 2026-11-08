import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, MapPin, ArrowRight, X, Sparkles } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { NewsEvent } from '../types.ts';

export const NewsSection: React.FC = () => {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const list = await apiService.getNews();
      setEvents(list);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="news" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Press & Community Announcements
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Latest News & Events
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Stay informed with upcoming camps, legal seminars, aid distributions, and association assemblies organized by LDA.
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs font-semibold">
            Loading updates...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No announcements published currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {ev.imageUrl && (
                    <div className="h-48 w-full overflow-hidden bg-slate-200">
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                        {ev.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{ev.date}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {ev.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="line-clamp-1">{ev.location}</span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Full Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  {selectedEvent.category}
                </span>
                <h3 className="text-xl font-bold font-serif text-white mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Date: {selectedEvent.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Venue: {selectedEvent.location}</span>
                </span>
              </div>

              {selectedEvent.imageUrl && (
                <div className="h-56 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                {selectedEvent.summary}
              </p>

              <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedEvent.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
