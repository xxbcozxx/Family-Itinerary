import { Coordinates, ItineraryStop, NavigationStep, RouteNavigationState } from '../types';

export class NavigationManager {
  private voiceEnabled = true;
  private voiceLanguage = 'en-US';
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private simulationInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  public setVoiceMuted(muted: boolean) {
    this.voiceEnabled = !muted;
    if (muted && this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public setVoiceLanguage(lang: string) {
    this.voiceLanguage = lang;
  }

  public speak(text: string) {
    if (!this.voiceEnabled || !this.synthesis || typeof window === 'undefined') return;

    try {
      this.synthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = this.voiceLanguage;
      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
    }
  }

  /**
   * Generates rich turn-by-turn navigation steps between a starting location and destination stop.
   */
  public generateRouteSteps(start: Coordinates, destination: ItineraryStop): NavigationStep[] {
    const isChina = destination.id.startsWith('chn');
    
    if (destination.id.includes('sydney') || destination.id === 'aus-d1-s1') {
      return [
        {
          id: 'step-1',
          instruction: 'Head north on George Street toward Alfred Street',
          roadName: 'George Street',
          maneuver: 'straight',
          distanceMeters: 450,
          distanceText: '450 m',
          durationSeconds: 90,
          durationText: '2 min',
          coordinates: { lat: -33.8610, lng: 151.2090 },
          speedLimitKmh: 40,
          trafficCondition: 'clear',
        },
        {
          id: 'step-2',
          instruction: 'Turn right onto Alfred Street toward Circular Quay',
          roadName: 'Alfred Street',
          maneuver: 'turn-right',
          distanceMeters: 300,
          distanceText: '300 m',
          durationSeconds: 60,
          durationText: '1 min',
          coordinates: { lat: -33.8615, lng: 151.2115 },
          speedLimitKmh: 40,
          trafficCondition: 'moderate',
          trafficDelayText: 'Moderate pedestrian flow near ferry concourse',
        },
        {
          id: 'step-3',
          instruction: 'Continue straight onto Macquarie Street',
          roadName: 'Macquarie Street',
          maneuver: 'straight',
          distanceMeters: 550,
          distanceText: '550 m',
          durationSeconds: 110,
          durationText: '2 min',
          coordinates: { lat: -33.8590, lng: 151.2135 },
          speedLimitKmh: 50,
          trafficCondition: 'clear',
          alert: {
            type: 'traffic',
            message: 'Real-time Traffic: Smooth flow along Royal Botanic Garden perimeter',
            severity: 'info',
          },
        },
        {
          id: 'step-4',
          instruction: 'At the roundabout, take the 2nd exit onto Bennelong Point Concourse',
          roadName: 'Bennelong Point Concourse',
          maneuver: 'roundabout',
          distanceMeters: 250,
          distanceText: '250 m',
          durationSeconds: 50,
          durationText: '1 min',
          coordinates: { lat: -33.8575, lng: 151.2145 },
          speedLimitKmh: 30,
          trafficCondition: 'clear',
        },
        {
          id: 'step-5',
          instruction: 'Arrive at Sydney Opera House on your right',
          roadName: 'Sydney Opera House Plaza',
          maneuver: 'destination',
          distanceMeters: 50,
          distanceText: '50 m',
          durationSeconds: 15,
          durationText: '1 min',
          coordinates: { lat: -33.8568, lng: 151.2153 },
          speedLimitKmh: 20,
          trafficCondition: 'clear',
          alert: {
            type: 'hazard',
            message: 'Destination Arrival: Underground parking entry on left (2.2m clearance)',
            severity: 'info',
          },
        },
      ];
    }

    if (isChina) {
      return [
        {
          id: 'step-chn-1',
          instruction: '沿长安街向东直行 (Head East along Chang\'an Avenue)',
          roadName: '东长安街 (East Chang\'an Ave)',
          maneuver: 'straight',
          distanceMeters: 800,
          distanceText: '800 米',
          durationSeconds: 120,
          durationText: '2 分钟',
          coordinates: { lat: 39.9075, lng: 116.3912 },
          speedLimitKmh: 60,
          trafficCondition: 'moderate',
          trafficDelayText: '实时路况：天安门东段车流量较大，通行放缓',
        },
        {
          id: 'step-chn-2',
          instruction: '在南池子大街路口向左转 (Turn Left onto Nanchizi Avenue)',
          roadName: '南池子大街',
          maneuver: 'turn-left',
          distanceMeters: 650,
          distanceText: '650 米',
          durationSeconds: 100,
          durationText: '2 分钟',
          coordinates: { lat: 39.9110, lng: 116.4020 },
          speedLimitKmh: 40,
          trafficCondition: 'clear',
          alert: {
            type: 'camera',
            message: '高德路况预警：前方200米有限速抓拍摄像头 (40km/h)',
            severity: 'warning',
          },
        },
        {
          id: 'step-chn-3',
          instruction: '向西进入景山前街 (Turn West onto Jingshan Front Street)',
          roadName: '景山前街',
          maneuver: 'turn-left',
          distanceMeters: 500,
          distanceText: '500 米',
          durationSeconds: 80,
          durationText: '1 分钟',
          coordinates: { lat: 39.9190, lng: 116.3990 },
          speedLimitKmh: 40,
          trafficCondition: 'clear',
        },
        {
          id: 'step-chn-4',
          instruction: '到达故宫博物院神武门/午门落客区 (Arrive at Palace Museum)',
          roadName: '故宫落客广场',
          maneuver: 'destination',
          distanceMeters: 80,
          distanceText: '80 米',
          durationSeconds: 20,
          durationText: '1 分钟',
          coordinates: { lat: 39.9163, lng: 116.3972 },
          speedLimitKmh: 20,
          trafficCondition: 'clear',
        },
      ];
    }

    // Default universal navigation sequence for other destinations
    return [
      {
        id: 'gen-step-1',
        instruction: `Head toward ${destination.locationName} along the main transit artery`,
        roadName: 'Coastal Highway',
        maneuver: 'straight',
        distanceMeters: 1200,
        distanceText: '1.2 km',
        durationSeconds: 180,
        durationText: '3 min',
        coordinates: { lat: start.lat, lng: start.lng },
        speedLimitKmh: 60,
        trafficCondition: 'clear',
      },
      {
        id: 'gen-step-2',
        instruction: `Turn right onto ${destination.title} Access Road`,
        roadName: 'Scenic Drive',
        maneuver: 'turn-right',
        distanceMeters: 600,
        distanceText: '600 m',
        durationSeconds: 90,
        durationText: '2 min',
        coordinates: { lat: destination.coordinates.lat + 0.003, lng: destination.coordinates.lng - 0.003 },
        speedLimitKmh: 40,
        trafficCondition: 'moderate',
        trafficDelayText: 'Minor slowing near visitor entrance',
      },
      {
        id: 'gen-step-3',
        instruction: `Arrive at ${destination.title}`,
        roadName: `${destination.locationName} Welcome Concourse`,
        maneuver: 'destination',
        distanceMeters: 50,
        distanceText: '50 m',
        durationSeconds: 20,
        durationText: '1 min',
        coordinates: destination.coordinates,
        speedLimitKmh: 20,
        trafficCondition: 'clear',
      },
    ];
  }

  public startSimulation(
    steps: NavigationStep[],
    onUpdate: (state: Partial<RouteNavigationState>) => void,
    onFinish: () => void
  ) {
    this.stopSimulation();

    let currentStep = 0;
    let stepProgress = 0;
    const totalSteps = steps.length;

    // Speak first instruction
    if (steps[0]) {
      this.speak(steps[0].instruction);
    }

    this.simulationInterval = setInterval(() => {
      if (currentStep >= totalSteps) {
        this.stopSimulation();
        this.speak('You have arrived at your destination.');
        onFinish();
        return;
      }

      const activeStep = steps[currentStep];
      stepProgress += 0.2; // advance step

      if (stepProgress >= 1.0) {
        stepProgress = 0;
        currentStep++;

        if (currentStep < totalSteps) {
          const nextStep = steps[currentStep];
          this.speak(nextStep.instruction);
          if (nextStep.alert?.message) {
            setTimeout(() => this.speak(nextStep.alert!.message), 2500);
          }
        }
      }

      const stepRemainingMeters = Math.max(0, Math.round(activeStep.distanceMeters * (1 - stepProgress)));
      const stepRemainingText = stepRemainingMeters > 1000 
        ? `${(stepRemainingMeters / 1000).toFixed(1)} km`
        : `${stepRemainingMeters} m`;

      let totalRemainingMeters = stepRemainingMeters;
      for (let i = currentStep + 1; i < totalSteps; i++) {
        totalRemainingMeters += steps[i].distanceMeters;
      }
      const totalRemainingText = totalRemainingMeters > 1000
        ? `${(totalRemainingMeters / 1000).toFixed(1)} km`
        : `${totalRemainingMeters} m`;

      const remainingSecs = Math.round(totalRemainingMeters / 12); // ~43 km/h
      const mins = Math.max(1, Math.round(remainingSecs / 60));

      onUpdate({
        currentStepIndex: currentStep,
        currentLocation: activeStep.coordinates,
        currentSpeedKmh: Math.min(activeStep.speedLimitKmh, Math.round(38 + Math.sin(Date.now() / 1000) * 8)),
        distanceToNextStepMeters: stepRemainingMeters,
        distanceToNextStepText: stepRemainingText,
        timeToNextStepText: `${Math.max(1, Math.round(stepRemainingMeters / 10))}s`,
        totalDistanceRemainingText: totalRemainingText,
        totalDurationRemainingText: `${mins} min`,
        activeAlert: activeStep.alert?.message,
      });
    }, 1800);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const navigationManager = new NavigationManager();
