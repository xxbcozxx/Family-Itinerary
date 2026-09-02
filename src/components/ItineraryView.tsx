import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coordinates, Itinerary, ItineraryDay, ItineraryStop } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  selectedStopId?: string;
  onSelectStop: (stop: ItineraryStop) => void;
  onStartNavigation: (stop: ItineraryStop) => void;
  onOpenLocalSearch: () => void;
  onToggleMapView: () => void;
  isMapExpanded: boolean;
  onAddStop: (dayNumber: number) => void;
  onEditStop: (stop: ItineraryStop) => void;
  onDeleteStop: (stopId: string, dayNumber: number) => void;
  onAddDay: () => void;
  onEditDay: (day: ItineraryDay) => void;
  onDeleteDay: (dayNumber: number) => void;
  onEditTrip: () => void;
  onOpenAIModal?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  selectedStopId,
  onSelectStop,
  onStartNavigation,
  onOpenLocalSearch,
  onToggleMapView,
  isMapExpanded,
  onAddStop,
  onEditStop,
  onDeleteStop,
  onAddDay,
  onEditDay,
  onDeleteDay,
  onEditTrip,
  onOpenAIModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    confetti({
      particleCount: 38,
      spread: 65,
      origin: { y: 0.9 },
      colors: ['#D9734E', '#2C362B', '#F9F6F0'],
    });

    setTimeout(() => {
      setCopied(false);
    }, 3200);
  };

  return (
    <div className="min-h-full pb-44">
      {/* Header / Cover Section */}
      <header className="pt-8 sm:pt-14 px-6 pb-6 text-center max-w-lg mx-auto relative">
        {/* Edit Trip Details & AI Imagery Hub Buttons */}
        <div className="flex items-center justify-end gap-2 mb-2">
          {onOpenAIModal && (
            <button
              onClick={onOpenAIModal}
              className="text-xs font-bold text-[#D9734E] hover:text-white hover:bg-[#D9734E] flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 transition-all shadow-xs cursor-pointer"
              title="Location-Aware Landmark & AI Imagery Hub"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>AI Imagery Hub</span>
            </button>
          )}
          <button
            onClick={onEditTrip}
            className="text-xs font-bold text-[#8A9389] hover:text-[#D9734E] flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 hover:bg-white border border-gray-200 transition-all shadow-xs cursor-pointer"
            title="Edit Title, Cover Image, and Trip Settings"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit Trip Info</span>
          </button>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-[#2C362B] leading-tight tracking-tight">
          {itinerary.title}
        </h1>
        {itinerary.subtitle && (
          <p className="text-[#8A9389] font-medium text-sm mb-2 italic">{itinerary.subtitle}</p>
        )}
        <p className="text-[#D9734E] font-bold tracking-[0.2em] uppercase text-xs mb-6">
          {itinerary.dateRange} • {itinerary.travelersCount} Travelers
        </p>

        {/* Cover Photo */}
        <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-6 shadow-[0_12px_40px_rgba(44,54,43,0.12)] group">
          <img
            alt={itinerary.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={itinerary.coverImage}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
            <span className="material-symbols-outlined text-xs text-[#D9734E]">location_on</span>
            <span>{itinerary.destination}</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#2C362B] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-black/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{itinerary.regionCountry}</span>
          </div>
        </div>

        {/* Editorial Summary Quote */}
        {itinerary.quote && (
          <div className="text-left px-1">
            <p className="font-serif text-base sm:text-lg leading-[1.8] text-[#2C362B] italic opacity-85">
              {itinerary.quote}
            </p>
          </div>
        )}

        {/* Quick Toolbar: Map Toggle & Search & Add Stop */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={onToggleMapView}
            className={`h-9 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all ${
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
            className="h-9 px-3.5 rounded-full bg-white text-[#2C362B] hover:bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base text-[#D9734E]">search</span>
            <span>Nearby Places</span>
          </button>

          <button
            onClick={() => onAddStop(itinerary.days[0]?.dayNumber || 1)}
            className="h-9 px-3.5 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>+ Add Stop</span>
          </button>
        </div>
      </header>

      {/* Timeline Days */}
      <main className="px-6 max-w-lg mx-auto mt-2">
        <div className="space-y-10">
          {itinerary.days.map((day) => (
            <section key={day.dayNumber} className="relative">
              {/* Sticky Day Header */}
              <div className="sticky top-0 bg-[#F9F6F0]/95 backdrop-blur-md py-3.5 z-10 border-b border-[#8A9389]/15 mb-6 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C362B]">
                      {day.title}
                    </h2>
                  </div>
                  <p className="text-[#8A9389] text-xs font-semibold">{day.dateStr}</p>
                  {day.summary && (
                    <p className="text-xs text-[#8A9389] mt-0.5 line-clamp-1">{day.summary}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={() => onAddStop(day.dayNumber)}
                    className="p-1 rounded-lg text-[#8A9389] hover:text-[#D9734E] hover:bg-white transition-colors"
                    title="Add stop to this day"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                  </button>
                  <button
                    onClick={() => onEditDay(day)}
                    className="p-1 rounded-lg text-[#8A9389] hover:text-[#2C362B] hover:bg-white transition-colors"
                    title="Edit day headline and details"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  {itinerary.days.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove Day ${day.dayNumber} and all its stops?`)) {
                          onDeleteDay(day.dayNumber);
                        }
                      }}
                      className="p-1 rounded-lg text-[#8A9389] hover:text-red-600 hover:bg-white transition-colors"
                      title="Delete this day"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 border-l-[1.5px] border-[#8A9389]/20 space-y-7 pb-4">
                {day.stops.length === 0 ? (
                  <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-white/40">
                    <p className="text-xs text-[#8A9389] font-medium mb-3">
                      No stops added for Day {day.dayNumber} yet.
                    </p>
                    <button
                      onClick={() => onAddStop(day.dayNumber)}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#D9734E] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#c4623e]"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add First Stop</span>
                    </button>
                  </div>
                ) : (
                  day.stops.map((stop, sIdx) => {
                    const isSelected = stop.id === selectedStopId;

                    return (
                      <div
                        key={stop.id}
                        className={`relative group transition-all duration-300 rounded-2xl p-3.5 -ml-3 ${
                          isSelected
                            ? 'bg-white shadow-md border border-[#D9734E]/30'
                            : 'hover:bg-white/60'
                        }`}
                      >
                        {/* Terracotta Pin Dot on the timeline axis */}
                        <div
                          className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full ${
                            isSelected
                              ? 'bg-[#2C362B] ring-[#D9734E]'
                              : 'bg-[#D9734E] ring-[#F9F6F0]'
                          } ring-4 transition-transform group-hover:scale-125 flex items-center justify-center`}
                        />

                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#D9734E] bg-[#D9734E]/10 w-5 h-5 rounded-full flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <h3
                                onClick={() => onSelectStop(stop)}
                                className="font-bold text-base sm:text-lg text-[#2C362B] cursor-pointer hover:text-[#D9734E] transition-colors"
                              >
                                {stop.title}
                              </h3>
                            </div>
                            {stop.subtitle && (
                              <p className="text-xs text-[#8A9389] font-medium mt-0.5 ml-7">
                                {stop.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {stop.timeSlot && (
                              <span className="text-[10px] font-bold text-[#D9734E] bg-[#D9734E]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {stop.timeSlot}
                              </span>
                            )}

                            {/* Stop Edit & Delete options */}
                            <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditStop(stop)}
                                className="p-1 text-gray-400 hover:text-[#2C362B] rounded-md hover:bg-gray-100 transition-colors"
                                title="Edit this stop"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove "${stop.title}" from Day ${day.dayNumber}?`)) {
                                    onDeleteStop(stop.id, day.dayNumber);
                                  }
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors"
                                title="Delete this stop"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {stop.description && (
                          <p className="text-[#2C362B]/80 text-xs sm:text-sm leading-relaxed mt-2">
                            {stop.description}
                          </p>
                        )}

                        {/* Optional Photo Attachment */}
                        {stop.imageUrl && (
                          <div className="mt-3 w-full h-40 rounded-[16px] overflow-hidden shadow-sm relative group/img">
                            <img
                              alt={stop.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                              src={stop.imageUrl}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-2 left-3 text-white text-[11px] font-semibold drop-shadow">
                              {stop.locationName}
                            </span>
                          </div>
                        )}

                        {/* Tips list */}
                        {stop.tips && stop.tips.length > 0 && (
                          <div className="mt-2.5 bg-[#F9F6F0] rounded-xl p-2.5 border border-[#8A9389]/15">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9389] block mb-0.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs text-[#D9734E]">lightbulb</span>
                              Traveler Insight
                            </span>
                            <p className="text-xs text-[#2C362B]/90 italic">
                              "{stop.tips[0]}"
                            </p>
                          </div>
                        )}

                        {/* Action Bar: Navigate & View on Map */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
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
                            className="h-7 px-3 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-all active:scale-95"
                            title="Start Turn-by-Turn Navigation with traffic and voice alerts"
                          >
                            <span className="material-symbols-outlined text-xs">navigation</span>
                            <span>Navigate</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          ))}

          {/* Add Another Day Button */}
          <div className="pt-2 text-center">
            <button
              onClick={onAddDay}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#2C362B] hover:text-[#D9734E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-base text-[#D9734E]">calendar_add_on</span>
              <span>+ Add Day {itinerary.days.length + 1} to Itinerary</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Share & Copy Bar (Explicit, clear, and easy to understand) */}
      <div className="fixed bottom-0 left-0 w-full p-4 sm:p-5 bg-gradient-to-t from-[#F9F6F0] via-[#F9F6F0]/95 to-transparent z-40 pointer-events-auto">
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <button
            onClick={handleShareLink}
            className={`w-full h-14 rounded-full font-bold uppercase tracking-[0.12em] text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(217,115,78,0.3)] transition-all active:scale-[0.98] ${
              copied
                ? 'bg-[#2C362B] text-white'
                : 'bg-[#D9734E] hover:bg-[#c4623e] text-white'
            }`}
            id="shareTripLinkBtn"
          >
            <span className="material-symbols-outlined text-xl">
              {copied ? 'task_alt' : 'share'}
            </span>
            <span>
              {copied
                ? 'Link Copied to Clipboard!'
                : 'Share Trip Link (Copy to Clipboard)'}
            </span>
          </button>
          <p className="text-[11px] text-[#8A9389] mt-1.5 font-medium text-center">
            {copied
              ? '✓ Web link ready to paste into WhatsApp, WeChat, or Telegram!'
              : 'Copy shareable web link to send this itinerary to family & travel companions'}
          </p>
        </div>
      </div>
    </div>
  );
};
