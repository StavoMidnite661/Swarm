import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Play, Sun, Calendar, AlertTriangle, 
  TrendingUp, RefreshCw, Cpu, Activity, ShieldCheck, Terminal,
  Volume2, VolumeX
} from 'lucide-react';

interface ExecutiveBriefingProps {
  onComplete: () => void;
  setYaw: (yaw: number) => void;
}

export default function ExecutiveBriefing({ onComplete, setYaw }: ExecutiveBriefingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [greeting, setGreeting] = useState('Good Morning, Sir.');
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Automatically determine the dynamic greeting based on actual time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning, Sir.');
    } else if (hours < 18) {
      setGreeting('Good Afternoon, Sir.');
    } else {
      setGreeting('Good Evening, Sir.');
    }
  }, []);

  // Set the canvas positions to center the orb and let it rotate slowly during briefing
  useEffect(() => {
    (window as any)._shaderOffsetX = 0.0;
    (window as any)._shaderOffsetY = 0.0;
    (window as any)._shaderZoom = 1.0;
    (window as any)._isDormant = false;
    (window as any)._shaderSpeed = 0.25;

    // Reset offsets when leaving
    return () => {
      (window as any)._shaderOffsetX = -0.15;
      (window as any)._shaderOffsetY = 0.15;
      (window as any)._shaderZoom = 1.69;
      // Stop speaking when leaving briefing
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const briefingSteps = [
    {
      id: 'greeting',
      title: 'Identity Verified',
      subtitle: greeting,
      desc: 'Sentinel Executive Intelligence Core v4.1 is fully compiled. Your sovereign operating system is active.',
      icon: ShieldCheck,
      metric: 'SECURE_ADMIN_ROLE',
      accentColor: 'border-cyan-500/30 text-cyan-400',
      speechText: `${greeting} Sentinel Executive Intelligence Core version 4 point 1 is fully compiled. Your sovereign operating system is active.`
    },
    {
      id: 'weather',
      title: 'Zurich Headquarters Weather',
      subtitle: '14°C — Light Alpine Fog',
      desc: 'Atmospheric density is stable. Zurich and Frankfurt compute nodes are operating at optimal cooler thresholds.',
      icon: Sun,
      metric: 'COOLING_NOMINAL',
      accentColor: 'border-orange-500/30 text-orange-400',
      speechText: "Zurich Headquarters Weather is fourteen degrees Celsius with Light Alpine Fog. Atmospheric density is stable. Zurich and Frankfurt compute nodes are operating at optimal cooler thresholds."
    },
    {
      id: 'calendar',
      title: 'Calendar Synchronization',
      subtitle: '3 Critical Strategic Events Today',
      desc: 'Escrow allocations require audit at 10:00 AM. MI6 agent briefing is scheduled for 2:00 PM at London Safehouse.',
      icon: Calendar,
      metric: '10:00 AM START',
      accentColor: 'border-purple-500/30 text-purple-400',
      speechText: "Calendar Synchronized. Three critical strategic events are scheduled today. Escrow allocations require audit at ten AM. Agent briefing is scheduled for two PM at the London Safehouse."
    },
    {
      id: 'priorities',
      title: 'Strategic Priorities',
      subtitle: 'Titan Acquisition & Compute Alignment',
      desc: 'Review the Titan Corp acquisition dossier and reallocate network compute balances on the operations matrix.',
      icon: Sparkles,
      metric: 'HIGH_PRIORITY',
      accentColor: 'border-yellow-500/30 text-yellow-400',
      speechText: "Strategic Priorities are defined. Review the Titan Corporation acquisition dossier and reallocate network compute balances on your operations matrix."
    },
    {
      id: 'overnight',
      title: 'Overnight Activity Log',
      subtitle: 'Frankfurt Node Auto-Replication',
      desc: 'Autonomous nodes finished replication. 8 containerized Swiss nodes validated and locked on active ledger.',
      icon: RefreshCw,
      metric: '8 NODES REPLICATED',
      accentColor: 'border-lime-500/30 text-lime-400',
      speechText: "Overnight Activity Log compiled. Frankfurt Node completed Auto-Replication. Eight containerized Swiss nodes have been validated and locked on the active ledger."
    },
    {
      id: 'health',
      title: 'Enterprise Health',
      subtitle: 'Sovereign Treasury: $19.36M Liquid',
      desc: 'Current enterprise health stands robust at 95.0%. Liquid asset metrics are up +18.4% this quarter.',
      icon: TrendingUp,
      metric: '95% ENTERPRISE HEALTH',
      accentColor: 'border-emerald-500/30 text-emerald-400',
      speechText: "Enterprise Health is robust at ninety-five percent. Sovereign Treasury stands at nineteen point three six million dollars liquid, with quarterly metrics up eighteen point four percent."
    },
    {
      id: 'alerts',
      title: 'Critical Escrow Warning',
      subtitle: 'Pending Sovereign Reserve Pool Signature',
      desc: '0 intrusion alerts detected. 1 compliance item is awaiting executive signature: Liquidate Sovereign Reserve Pool.',
      icon: AlertTriangle,
      metric: '1 SIGNATURE REQUIRED',
      accentColor: 'border-red-500/30 text-red-400',
      speechText: "Compliance Alert. Zero intrusion alerts detected, but one compliance item is awaiting your executive signature to liquidate the Sovereign Reserve Pool."
    },
    {
      id: 'console',
      title: 'Core Updates Compiled',
      subtitle: 'Model Handshakes Complete',
      desc: 'REST and Live-Audio pathways are secured. Audio link stands ready to establish sovereign voice stream.',
      icon: Cpu,
      metric: 'TLS_1.3_ENCRYPTED',
      accentColor: 'border-cyan-500/30 text-cyan-400',
      speechText: "Core Updates Compiled. Model Handshakes are complete. REST and Live-Audio pathways are secured. Your audio link stands ready to establish sovereign voice stream."
    },
    {
      id: 'status',
      title: 'System Status',
      subtitle: 'Autopilot Confidence: 97.2%',
      desc: 'Sentinel background operations are humming on standby. Real-time organization knowledge is synchronized.',
      icon: Activity,
      metric: '97.2% PREDICTION',
      accentColor: 'border-blue-500/30 text-blue-400',
      speechText: "System Status is nominal. Autopilot confidence is at ninety-seven point two percent. Sentinel background operations are humming on standby."
    },
    {
      id: 'recommendation',
      title: 'Chief of Staff Recommendation',
      subtitle: 'Proceed to Command Integration',
      desc: 'Stavogm, I advise immediate integration of the Command Deck. Let us review the ledger gate and execute the Titan takeover.',
      icon: Terminal,
      metric: 'CONVERT VISION TO EXECUTION',
      accentColor: 'border-violet-500/30 text-violet-400 font-bold',
      speechText: "Chief of Staff Recommendation. Stavogm, I advise immediate integration of the Command Deck. Let us review the ledger gate and execute the Titan takeover. Convert vision to execution."
    }
  ];

  // Vocalize current step with browser SpeechSynthesis
  useEffect(() => {
    if (!window.speechSynthesis || isMuted) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Cancel active synthesis first
    window.speechSynthesis.cancel();

    const textToSpeak = briefingSteps[currentStep].speechText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Try to find a premium, calm, deep English voice (such as Google UK English Male/Female, Microsoft David, etc.)
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => 
      v.name.includes('Google UK English') || 
      v.name.includes('Premium') || 
      v.name.includes('Natural') || 
      (v.lang.startsWith('en') && v.name.includes('Male'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    // Set professional, calm, measured speech rates
    utterance.rate = 0.94;
    utterance.pitch = 0.95;

    // Advance to next slide when speech is complete
    utterance.onend = () => {
      if (currentStep < briefingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Add a tiny 1.2-second comfortable pause at the end of the final voice statement before integrating
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, isMuted]);

  // Handle auto-progressing steps
  useEffect(() => {
    // If NOT muted, we rely ENTIRELY on the voice ending to progress to the next step
    if (!isMuted && window.speechSynthesis) {
      return;
    }

    // Otherwise, if muted or not supported, we progress with a classic interval
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < briefingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Auto-integrate after holding on the last slide for 5 seconds
          setTimeout(() => {
            onComplete();
          }, 5000);
          return prev;
        }
      });
    }, 7500);

    return () => clearInterval(interval);
  }, [isMuted]);

  const activeStep = briefingSteps[currentStep];
  const IconComponent = activeStep.icon;

  const handleNext = () => {
    if (currentStep < briefingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="absolute inset-0 z-50 h-screen w-screen bg-black/65 backdrop-blur-xl flex flex-col items-center justify-between p-8 text-white select-none overflow-hidden"
    >
      {/* Abstract luxury ambient radial gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Cinematic Top Header */}
      <header className="w-full max-w-6xl flex items-center justify-between border-b border-white/[0.04] pb-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[10px] tracking-[0.25em] font-sans text-white/50 uppercase font-light">SENTINEL OPERATING OS</h1>
            <span className="text-[11px] font-sans text-white font-medium tracking-[0.1em] uppercase">SYSTEM INITIALIZATION BRIEF</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] tracking-widest text-white/40 uppercase font-light">
          {/* Audio Output Status Toggle */}
          <button 
            onClick={handleToggleMute}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg transition-all text-white/70 hover:text-white"
          >
            {isMuted ? (
              <>
                <VolumeX size={12} className="text-red-400" />
                <span>VOICE MUTED</span>
              </>
            ) : (
              <>
                <Volume2 size={12} className="text-cyan-400 animate-pulse" />
                <span>VOICE STREAM ACTIVE</span>
              </>
            )}
          </button>
          <div className="h-3 w-[1px] bg-white/[0.08]" />
          <div>ZURICH: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          <div className="h-3 w-[1px] bg-white/[0.08]" />
          <div>CONFIDENCE: 97.2%</div>
        </div>
      </header>

      {/* Center Cinematic Display containing Orb Overlay & Briefing Panels */}
      <div className="flex-1 w-full max-w-5xl flex flex-col justify-center items-center relative z-10 my-6 min-h-0">
        
        {/* Step Indicator Dot Array */}
        <div className="flex gap-2.5 mb-8">
          {briefingSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentStep 
                  ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                  : idx < currentStep 
                    ? 'w-2.5 bg-white/40' 
                    : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Cinematic Briefing Glass Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-black/45 backdrop-blur-[48px] border border-white/[0.08] border-t-white/[0.2] border-l-white/[0.12] p-8 md:p-10 rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(255,255,255,0.15)] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden"
          >
            {/* Fine geometric layout elements to signal extreme precision */}
            <div className="absolute top-0 left-0 w-6 h-[1px] bg-white/20" />
            <div className="absolute top-0 left-0 w-[1px] h-6 bg-white/20" />
            <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-white/20" />
            <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-white/20" />

            {/* Left Column: Icon + Metric */}
            <div className="flex flex-col items-center shrink-0 w-full md:w-36 gap-4">
              <div className={`p-5 rounded-[22px] bg-white/[0.02] border ${activeStep.accentColor} shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/[0.01]" />
                <IconComponent size={36} strokeWidth={1.2} />
              </div>
              <div className="text-center">
                <span className="text-[9px] tracking-[0.2em] font-sans text-white/40 uppercase font-light">Status Node</span>
                <div className="text-[10px] font-sans font-medium text-white/80 tracking-widest uppercase mt-0.5 whitespace-nowrap">
                  {activeStep.metric}
                </div>
              </div>
            </div>

            {/* Right Column: Briefing Text Content */}
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[10px] font-sans tracking-[0.3em] text-cyan-400 uppercase font-semibold">
                SYSTEM BRIEFING // 0{currentStep + 1}
              </span>
              <h2 className="text-2xl md:text-3xl font-sans font-light tracking-tight text-white/95 leading-tight">
                {activeStep.subtitle}
              </h2>
              <p className="text-[13px] font-sans font-light leading-relaxed text-white/60 tracking-wide mt-1.5">
                {activeStep.desc}
              </p>

              {/* Subsurface Waveform showing Sentinel is speaking */}
              <div className="mt-8 flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] p-3 rounded-2xl max-w-md shadow-sm">
                <div className="flex gap-1 items-end h-6 w-12 overflow-hidden pb-1 flex-shrink-0">
                  {[...Array(8)].map((_, i) => {
                    const animationDurations = ['1s', '1.4s', '0.8s', '1.2s', '1.1s', '1.5s', '0.7s', '1.3s'];
                    return (
                      <motion.div
                        key={i}
                        animate={{ height: isMuted ? '4px' : ['4px', '22px', '4px'] }}
                        transition={isMuted ? {} : { duration: parseFloat(animationDurations[i]), repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 bg-cyan-400/80 rounded-full"
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] tracking-[0.15em] font-sans text-white/30 uppercase font-light">Sentinel AI Voice</span>
                  <span className="text-[10px] font-sans text-white/70 tracking-wider font-light mt-0.5">
                    {isMuted ? 'Stream muted' : 'Transmitting vocal synth...'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Control Bar */}
      <footer className="w-full max-w-6xl flex items-center justify-between border-t border-white/[0.04] pt-6 shrink-0 relative z-10">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`px-5 py-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.06] rounded-xl text-[10px] font-sans tracking-widest uppercase font-medium transition-all text-white/50 hover:text-white ${
            currentStep === 0 ? 'opacity-20 pointer-events-none' : ''
          }`}
        >
          PREVIOUS NODE
        </button>

        {/* Skip button with luxury branding */}
        <button
          onClick={() => {
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            onComplete();
          }}
          className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-xl text-[10px] tracking-[0.2em] font-sans font-semibold uppercase flex items-center gap-2.5 shadow-[0_4px_24px_rgba(255,255,255,0.25)] border border-white transition-all active:scale-95"
        >
          <span>INTEGRATE CONSOLE</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] rounded-xl text-[10px] font-sans tracking-widest uppercase font-medium transition-all text-white/80 hover:text-white"
        >
          {currentStep === briefingSteps.length - 1 ? 'LAUNCH CONSOLE' : 'NEXT NODE'}
        </button>
      </footer>
    </motion.div>
  );
}

