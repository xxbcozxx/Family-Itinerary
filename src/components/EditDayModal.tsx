import React, { useState, useEffect } from 'react';
import { ItineraryDay } from '../types';

interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: ItineraryDay) => void;
  initialDay?: ItineraryDay | null;
  suggestedDayNumber: number;
}

export const EditDayModal: React.FC<EditDayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDay,
  suggestedDayNumber,
}) => {
  const [dayNumber, setDayNumber] = useState(suggestedDayNumber);
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (initialDay) {
      setDayNumber(initialDay.dayNumber);
      setTitle(initialDay.title);
      setDateStr(initialDay.dateStr);
      setSummary(initialDay.summary || '');
    } else {
      setDayNumber(suggestedDayNumber);
      setTitle(`Day ${suggestedDayNumber}: Highlights`);
      setDateStr(`Day ${suggestedDayNumber}`);
      setSummary('');
    }
  }, [initialDay, suggestedDayNumber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dayData: ItineraryDay = {
      dayNumber: Number(dayNumber) || suggestedDayNumber,
      title: title.trim(),
      dateStr: dateStr.trim() || `Day ${dayNumber}`,
      summary: summary.trim() || undefined,
      stops: initialDay ? initialDay.stops : [],
    };

    onSave(dayData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#2C362B]/10">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D9734E] text-2xl">
              calendar_add_on
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C362B]">
              {initialDay ? `Edit Day ${initialDay.dayNumber}` : 'Add New Day to Itinerary'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Day Number
            </label>
            <input
              type="number"
              min={1}
              value={dayNumber}
              onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#2C362B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Day Theme / Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Day 4: Universal Studios & CityWalk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#2C362B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Date String
            </label>
            <input
              type="text"
              placeholder="e.g., Dec 15, 2026 / Dec 2026"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Day Overview / Summary
            </label>
            <textarea
              rows={2}
              placeholder="Short summary of today's key theme and activities..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{initialDay ? 'Save Day' : 'Add Day'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
