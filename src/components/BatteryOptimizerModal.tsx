import React from 'react';
import { BatteryMode, BatteryStatusInfo } from '../types';

interface BatteryOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  batteryMode: BatteryMode;
  onSelectMode: (mode: BatteryMode) => void;
  batteryInfo: BatteryStatusInfo;
}

export const BatteryOptimizerModal: React.FC<BatteryOptimizerModalProps> = ({
  isOpen,
  onClose,
  batteryMode,
  onSelectMode,
  batteryInfo,
}) => {
  if (!isOpen) return null;

  const batteryPercent = Math.round(batteryInfo.level * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F9F6F0] text-[#2C362B] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#2C362B]/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C362B]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D9734E]/15 flex items-center justify-center text-[#D9734E]">
              <span className="material-symbols-outlined text-xl">battery_charging_full</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C362B]">Battery Efficiency</h3>
              <p className="text-xs text-[#8A9389]">Dual-engine location power management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Battery Health & Level Card */}
        <div className="mt-5 p-4 rounded-2xl bg-white shadow-sm border border-[#2C362B]/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#f0ede6"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke={batteryPercent < 20 ? '#EF4444' : '#D9734E'}
                  strokeWidth="5"
                  strokeDasharray={150.8}
                  strokeDashoffset={150.8 * (1 - batteryInfo.level)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-bold text-sm text-[#2C362B]">{batteryPercent}%</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#2C362B]">
                  {batteryInfo.charging ? 'Charging (Fast Charge)' : 'Discharging on Battery'}
                </span>
                {batteryInfo.charging && (
                  <span className="material-symbols-outlined text-sm text-emerald-600">bolt</span>
                )}
              </div>
              <p className="text-xs text-[#8A9389] mt-0.5">
                GPS Duty Cycle: <span className="font-semibold text-[#2C362B]">{batteryInfo.dutyCyclePercent}%</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Optimal
            </span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A9389]">
            Select Location Tracking Profile
          </h4>

          {/* Balanced Mode */}
          <button
            onClick={() => onSelectMode('balanced')}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              batteryMode === 'balanced'
                ? 'bg-[#2C362B] text-white border-[#2C362B] shadow-md'
                : 'bg-white text-[#2C362B] border-gray-200 hover:border-[#D9734E]'
            }`}
          >
            <div className={`p-2 rounded-xl mt-0.5 ${batteryMode === 'balanced' ? 'bg-[#D9734E] text-white' : 'bg-gray-100 text-[#2C362B]'}`}>
              <span className="material-symbols-outlined text-lg">tune</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Balanced Mode (Recommended)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${batteryMode === 'balanced' ? 'bg-white/20 text-white' : 'bg-[#D9734E]/10 text-[#D9734E]'}`}>
                  -60% Battery
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${batteryMode === 'balanced' ? 'text-white/80' : 'text-[#8A9389]'}`}>
                Smart adaptive GPS interval. Automatically throttles polling when stationary (&lt;5m displacement).
              </p>
            </div>
          </button>

          {/* Ultra Battery Saver Mode */}
          <button
            onClick={() => onSelectMode('ultra_battery_saver')}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              batteryMode === 'ultra_battery_saver'
                ? 'bg-[#2C362B] text-white border-[#2C362B] shadow-md'
                : 'bg-white text-[#2C362B] border-gray-200 hover:border-[#D9734E]'
            }`}
          >
            <div className={`p-2 rounded-xl mt-0.5 ${batteryMode === 'ultra_battery_saver' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-[#2C362B]'}`}>
              <span className="material-symbols-outlined text-lg">energy_savings_leaf</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Ultra Battery Saver</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${batteryMode === 'ultra_battery_saver' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  -85% Battery
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${batteryMode === 'ultra_battery_saver' ? 'text-white/80' : 'text-[#8A9389]'}`}>
                Low-power cell/WiFi geocoding (35s interval). Pauses GPS automatically when app is backgrounded.
              </p>
            </div>
          </button>

          {/* High Accuracy */}
          <button
            onClick={() => onSelectMode('high_accuracy')}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              batteryMode === 'high_accuracy'
                ? 'bg-[#2C362B] text-white border-[#2C362B] shadow-md'
                : 'bg-white text-[#2C362B] border-gray-200 hover:border-[#D9734E]'
            }`}
          >
            <div className={`p-2 rounded-xl mt-0.5 ${batteryMode === 'high_accuracy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#2C362B]'}`}>
              <span className="material-symbols-outlined text-lg">near_me</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">High Accuracy GPS</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  Continuous
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${batteryMode === 'high_accuracy' ? 'text-white/80' : 'text-[#8A9389]'}`}>
                Sub-meter satellite precision (1-2s updates). Recommended for active driving and fast lane changes.
              </p>
            </div>
          </button>
        </div>

        {/* Done Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
