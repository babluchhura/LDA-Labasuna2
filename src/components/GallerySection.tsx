import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Filter, X, Calendar, MapPin } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { GalleryItem } from '../types.ts';

const CATEGORIES = [
  'All',
  'Social Work',
  'Community Events',
  'Education Activities',
  'Health Awareness',
  'Public Welfare Programmes',
];

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const list = await apiService.getGallery();
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(i => i.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(i.category.toLowerCase()));

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Visual Documentation
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            LDA Activities & Photo Gallery
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Glimpses of ground actions, free medical camps, educational distribution, and community drives led by Advocate Laba Suna and LDA volunteers in Odisha.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs font-semibold">
            Loading gallery archives...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No photographs available under this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-800">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      <span>{item.eventDate || 'Recent'}</span>
                    </span>
                    <span>Lathore, Odisha</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-800 transition">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96 w-full bg-slate-900">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedPhoto.eventDate || 'Lathore, Odisha'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.description && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
