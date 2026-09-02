import React from 'react';
import { NavigationStep, RouteNavigationState } from '../types';

interface NavigationHudProps {
  navState: RouteNavigationState;
  activeDestinationTitle: string;
  onStopNav: () => void;
  onToggleVoice: () => void;
  onSkipStep?: () => void;
}

export const NavigationHud: React.FC<NavigationHudProps> = ({
  navState,
  activeDestinationTitle,
  onStopNav,
  onToggleVoice,
  onSkipStep,
}) => {
  const currentStep: NavigationStep | undefined = navState.routeSteps[navState.currentStepIndex];

  const getManeuverIcon = (maneuver?: string) => {
    switch (maneuver) {
      case 'turn-left':
        return 'turn_left';
      case 'turn-right':
        return 'turn_right';
      case 'slight-left':
        return 'turn_slight_left';
      case 'slight-right':
        return 'turn_slight_right';
      case 'roundabout':
        return 'roundabout_right';
      case 'destination':
        return 'flag';
      case 'u-turn':
        return 'u_turn_left';
      default:
        return 'straight';
    }
  };

  const getTrafficColor = (condition?: string) => {
    switch (condition) {
      case 'heavy':
      case 'incident':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="absolute inset-x-4 top-4 z-40 flex flex-col gap-3 max-w-lg mx-auto pointer-events-auto">
      {/* Top Main Maneuver Card */}
      <div className="bg-[#2C362B] text-[#F9F6F0] rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D9734E] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-3xl">
              {getManeuverIcon(currentStep?.maneuver)}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-extrabold tracking-tight text-white">
                {navState.distanceToNextStepText}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#8A9389]">
                In {navState.timeToNextStepText}
              </span>
            </div>
            <p className="text-sm font-semibold text-white/90 line-clamp-1 mt-0.5">
              {currentStep?.instruction || `Heading to ${activeDestinationTitle}`}
            </p>
          </div>
        </div>

        {/* Speed & Speed Limit */}
        <div className="flex flex-col items-center pl-3 border-l border-white/15">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-white flex flex-col items-center justify-center text-[#2C362B] shadow-inner">
            <span className="text-[11px] font-black leading-none">
              {currentStep?.speedLimitKmh || 50}
            </span>
            <span className="text-[7px] uppercase font-bold text-gray-400">km/h</span>
          </div>
          <span className="text-[10px] text-[#8A9389] mt-1 font-medium">
            {navState.currentSpeedKmh} km/h
          </span>
        </div>
      </div>

      {/* Real-time Traffic Alert Bar if active */}
      {currentStep?.alert && (
        <div className="bg-amber-600/95 text-white rounded-xl px-3.5 py-2 text-xs flex items-center gap-2 shadow-lg backdrop-blur-md animate-pulse">
          <span className="material-symbols-outlined text-base text-amber-200">
            {currentStep.alert.type === 'camera' ? 'speed' : 'traffic'}
          </span>
          <span className="font-medium flex-1 line-clamp-1">{currentStep.alert.message}</span>
        </div>
      )}

      {/* Active Traffic Status Pill */}
      {currentStep?.trafficDelayText && (
        <div className="bg-[#211511]/90 text-amber-300 rounded-xl px-3.5 py-1.5 text-xs flex items-center gap-2 border border-amber-400/20 backdrop-blur-md">
          <span className="material-symbols-outlined text-sm text-amber-400">fmd_bad</span>
          <span className="line-clamp-1">{currentStep.trafficDelayText}</span>
        </div>
      )}

      {/* Floating Bottom Nav Controls */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#2C362B]/10 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#2C362B]">
                {navState.totalDurationRemainingText}
              </span>
              <span className="text-xs font-semibold text-[#D9734E]">
                ({navState.totalDistanceRemainingText})
              </span>
            </div>
            <span className="text-[11px] text-[#8A9389]">
              Destination: {activeDestinationTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Prompt Toggle */}
          <button
            onClick={onToggleVoice}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              navState.isVoiceMuted
                ? 'bg-gray-200 text-gray-500'
                : 'bg-[#D9734E]/15 text-[#D9734E] hover:bg-[#D9734E]/25'
            }`}
            title={navState.isVoiceMuted ? 'Unmute voice navigation' : 'Mute voice alerts'}
          >
            <span className="material-symbols-outlined text-xl">
              {navState.isVoiceMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* End Navigation */}
          <button
            onClick={onStopNav}
            className="h-10 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};
