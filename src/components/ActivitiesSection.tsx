import React from 'react';
import { Scale, HeartHandshake, BookOpen, Stethoscope, Users, Gift, ShieldAlert, Check, ArrowRight } from 'lucide-react';

interface ActivitiesSectionProps {
  onJoinClick?: () => void;
  onGalleryClick?: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ onJoinClick, onGalleryClick }) => {
  const activities = [
    {
      id: 'social-work',
      title: 'Social Work Activities & Legal Aid',
      category: 'Legal & Advocacy',
      icon: Scale,
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=700&q=80',
      description: 'Under Advocate Laba Suna’s legal expertise, LDA operates pro-bono counseling desks resolving land tenancy, matrimonial disputes, police harassment, and constitutional entitlement denials for indigent villagers.',
      points: [
        'Free legal counseling and representation in local courts',
        'Right to Information (RTI) advocacy for public works transparency',
        'Legal literacy workshops in tribal gram panchayats',
        'Mediation of rural civil disputes avoiding lengthy litigation',
      ],
    },
    {
      id: 'community-development',
      title: 'Community Development & Village Welfare',
      category: 'Infrastructure & Empowerment',
      icon: Users,
      color: 'amber',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80',
      description: 'Mobilizing rural youth and village councils for community cleanliness, sanitation facilities, solar lighting advocacy, and establishing Women Self-Help Groups (SHGs) for financial independence.',
      points: [
        'Village cleanliness, drainage repair, and safe drinking water drives',
        'Facilitating government rural schemes (PMAY, MGNREGA, PM-KISAN)',
        'Youth leadership and vocational skill orientation workshops',
        'Tree plantation drives along rural highways and panchayat lands',
      ],
    },
    {
      id: 'education-support',
      title: 'Education Support for Underprivileged Youth',
      category: 'Child Education',
      icon: BookOpen,
      color: 'indigo',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
      description: 'Ensuring zero dropout rates in remote hamlets through direct textbook distribution, school uniform drives, evening coaching centers, and special scholarship programs for girl students.',
      points: [
        'Distribution of notebooks, school bags, geometry boxes & stationery',
        'Financial aid for higher secondary and vocational education',
        'Community evening study centers with volunteer teachers',
        'Campaigns against child labor and early child marriage',
      ],
    },
    {
      id: 'health-awareness',
      title: 'Health Awareness & Free Medical Camps',
      category: 'Public Health',
      icon: Stethoscope,
      color: 'emerald',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      description: 'Conducting periodic multi-specialty medical camps, eye screening tests with free spectacles distribution, blood donation drives, and maternal-child health nutrition counseling in Lathore and neighboring areas.',
      points: [
        'Free consultations with experienced doctors and free medicines',
        'Cataract screening and sponsored eye surgery tie-ups',
        'Voluntary blood donation camps collecting 100+ units annually',
        'Malaria, dengue, and seasonal epidemic preventive awareness',
      ],
    },
    {
      id: 'helping-poor',
      title: 'Helping Poor and Needy People',
      category: 'Humanitarian Relief',
      icon: Gift,
      color: 'rose',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80',
      description: 'Immediate humanitarian intervention during monsoon floods, summer heatwaves, or winter chills—distributing dry ration kits, warm blankets, emergency clothing, and medical aid to destitute elders.',
      points: [
        'Emergency food grain kits (rice, pulses, oil) for indigent families',
        'Annual winter blanket distribution to homeless and elder citizens',
        'Direct monetary relief during medical emergencies and accidents',
        'Support for widows and disabled persons to secure government pensions',
      ],
    },
  ];

  return (
    <section id="activities" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Our Work On Ground
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
            Social Work & Community Activities
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            LDA operates a 360-degree welfare framework ensuring that no marginalized citizen in our territory is left without legal defense, basic food security, or educational guidance.
          </p>
        </div>

        {/* Activities List */}
        <div className="space-y-12">
          {activities.map((act, index) => {
            const Icon = act.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={act.id}
                className={`bg-slate-50/80 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Photo Column */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 sm:h-72 w-full group">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-800">
                      {act.category}
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                      {act.title}
                    </h3>
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {act.description}
                  </p>

                  {/* Bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {act.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    {onJoinClick && (
                      <button
                        onClick={onJoinClick}
                        className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 group cursor-pointer"
                      >
                        <span>Volunteer in this Programme</span>
                        <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Want to Support or Partner with LDA?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
            Whether you are a legal professional, a doctor, a teacher, or a dedicated volunteer, join hands with Advocate Laba Suna to create lasting social impact.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {onJoinClick && (
              <button
                onClick={onJoinClick}
                className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition cursor-pointer"
              >
                Register as Member Today
              </button>
            )}
            {onGalleryClick && (
              <button
                onClick={onGalleryClick}
                className="px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm border border-blue-600 transition cursor-pointer"
              >
                Browse Our Photo Gallery
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
