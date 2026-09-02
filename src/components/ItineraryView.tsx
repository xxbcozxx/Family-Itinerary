import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coordinates, Itinerary, ItineraryStop } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  selectedStopId?: string;
  onSelectStop: (stop: ItineraryStop) => void;
  onStartNavigation: (stop: ItineraryStop) => void;
  onOpenLocalSearch: () => void;
  onToggleMapView: () => void;
  isMapExpanded: boolean;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  selectedStopId,
  onSelectStop,
  onStartNavigation,
  onOpenLocalSearch,
  onToggleMapView,
  isMapExpanded,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#D9734E', '#2C362B', '#F9F6F0'],
    });

    setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  return (
    <div className="min-h-full pb-32">
      {/* Header / Cover Section */}
      <header className="pt-10 sm:pt-16 px-6 pb-8 text-center max-w-lg mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3 text-[#2C362B] leading-tight tracking-tight">
          {itinerary.title}
        </h1>
        <p className="text-[#8A9389] font-semibold tracking-[0.2em] uppercase text-xs mb-8">
          {itinerary.dateRange}
        </p>

        {/* Cover Photo */}
        <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-8 shadow-[0_12px_40px_rgba(44,54,43,0.12)] group">
          <img
            alt={itinerary.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={itinerary.coverImage}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
            <span className="material-symbols-outlined text-xs text-[#D9734E]">location_on</span>
            <span>{itinerary.destination}</span>
          </div>
        </div>

        {/* Editorial Summary Quote */}
        <div className="text-left px-1">
          <p className="font-serif text-lg sm:text-xl leading-[1.8] text-[#2C362B] italic opacity-85">
            {itinerary.quote}
          </p>
        </div>

        {/* Quick Toolbar: Map Toggle & Search */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onToggleMapView}
            className={`h-10 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all ${
              isMapExpanded
                ? 'bg-[#2C362B] text-white'
                : 'bg-white text-[#2C362B] hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#D9734E]">
              {isMapExpanded ? 'view_agenda' : 'map'}
            </span>
            <span>{isMapExpanded ? 'Collapse Map' : 'Explore on Map'}</span>
          </button>

          <button
            onClick={onOpenLocalSearch}
            className="h-10 px-4 rounded-full bg-white text-[#2C362B] hover:bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base text-[#D9734E]">search</span>
            <span>Nearby Places</span>
          </button>
        </div>
      </header>

      {/* Minimal Timeline */}
      <main className="px-6 max-w-lg mx-auto mt-4">
        <div className="space-y-12">
          {itinerary.days.map((day) => (
            <section key={day.dayNumber} className="relative">
              {/* Sticky Day Header */}
              <div className="sticky top-0 bg-[#F9F6F0]/95 backdrop-blur-md py-3.5 z-10 border-b border-[#8A9389]/15 mb-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C362B]">
                    {day.title}
                  </h2>
                  <p className="text-[#8A9389] text-xs sm:text-sm font-semibold">{day.dateStr}</p>
                </div>
                {day.summary && (
                  <p className="text-xs text-[#8A9389] mt-1 line-clamp-1">{day.summary}</p>
                )}
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 border-l-[1.5px] border-[#8A9389]/20 space-y-8 pb-4">
                {day.stops.map((stop) => {
                  const isSelected = stop.id === selectedStopId;

                  return (
                    <div
                      key={stop.id}
                      className={`relative group transition-all duration-300 rounded-2xl p-3 -ml-3 ${
                        isSelected ? 'bg-white shadow-md border border-[#D9734E]/30' : 'hover:bg-white/50'
                      }`}
                    >
                      {/* Terracotta Pin Dot on the timeline axis */}
                      <div
                        className={`absolute -left-[31px] top-4 w-3 h-3 rounded-full ${
                          isSelected ? 'bg-[#2C362B] ring-[#D9734E]' : 'bg-[#D9734E] ring-[#F9F6F0]'
                        } ring-4 transition-transform group-hover:scale-125`}
                      />

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            onClick={() => onSelectStop(stop)}
                            className="font-bold text-lg sm:text-xl text-[#2C362B] mb-0.5 cursor-pointer hover:text-[#D9734E] transition-colors"
                          >
                            {stop.title}
                          </h3>
                          {stop.subtitle && (
                            <p className="text-xs text-[#8A9389] font-medium mb-1.5">
                              {stop.subtitle}
                            </p>
                          )}
                        </div>

                        {stop.timeSlot && (
                          <span className="text-[11px] font-bold text-[#D9734E] bg-[#D9734E]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {stop.timeSlot}
                          </span>
                        )}
                      </div>

                      <p className="text-[#2C362B]/80 text-sm leading-relaxed mt-1">
                        {stop.description}
                      </p>

                      {/* Optional Photo Attachment */}
                      {stop.imageUrl && (
                        <div className="mt-3.5 w-full h-44 rounded-[16px] overflow-hidden shadow-sm relative group/img">
                          <img
                            alt={stop.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            src={stop.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow">
                            {stop.locationName}
                          </span>
                        </div>
                      )}

                      {/* Tips list */}
                      {stop.tips && stop.tips.length > 0 && (
                        <div className="mt-3 bg-[#F9F6F0] rounded-xl p-2.5 border border-[#8A9389]/15">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9389] block mb-1">
                            Traveler Insight
                          </span>
                          <p className="text-xs text-[#2C362B]/90 italic">
                            "{stop.tips[0]}"
                          </p>
                        </div>
                      )}

                      {/* Action Bar: Navigate & View on Map */}
                      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectStop(stop)}
                            className="text-xs font-bold text-[#2C362B] hover:text-[#D9734E] flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">map</span>
                            View Pin
                          </button>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-[#8A9389]">
                            {stop.duration || '2 hrs'}
                          </span>
                        </div>

                        <button
                          onClick={() => onStartNavigation(stop)}
                          className="h-8 px-3.5 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all active:scale-95"
                          title="Start Turn-by-Turn Navigation with traffic and voice alerts"
                        >
                          <span className="material-symbols-outlined text-xs">navigation</span>
                          <span>Navigate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Bottom Action Bar (Fixed, matching the exact HTML code) */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F9F6F0] via-[#F9F6F0]/90 to-transparent z-40 pointer-events-auto">
        <button
          onClick={handleCopyLink}
          className={`w-full max-w-lg mx-auto h-14 rounded-full font-bold uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(217,115,78,0.3)] transition-all active:scale-[0.98] ${
            copied
              ? 'bg-[#2C362B] text-white'
              : 'bg-[#D9734E] hover:bg-[#D9734E]/90 text-white'
          }`}
          id="copyLinkBtn"
        >
          <span className="material-symbols-outlined text-xl">
            {copied ? 'check' : 'link'}
          </span>
          <span id="btnText">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};
