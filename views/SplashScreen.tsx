
import React, { useEffect, useState, useRef } from 'react';
import { Power, Zap, ChevronRight, Fingerprint, Activity } from 'lucide-react';

interface SplashScreenProps {
  onStart?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const requestRef = useRef<number>(0);

  const HOLD_DURATION = 1000; // Slightly faster 1s for snappy feel

  const startHolding = () => {
    if (isComplete) return;
    setIsHolding(true);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const stopHolding = () => {
    if (isComplete) return;
    setIsHolding(false);
    // Rapid decay
    const decay = () => {
        setProgress(prev => {
            if (prev <= 0) return 0;
            requestRef.current = requestAnimationFrame(decay);
            return prev - 8; 
        });
    };
    decay();
  };

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
        if (!isHolding || isComplete) {
            startTime = null;
            return;
        }

        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Exponential progress for "revving" feel
        const rawProgress = Math.min(elapsed / HOLD_DURATION, 1);
        const easedProgress = Math.pow(rawProgress, 2); 
        const newPercentage = easedProgress * 100;

        setProgress(newPercentage);

        // Haptic feedback ramp up
        if (rawProgress > 0.2 && Math.random() > 0.8 && navigator.vibrate) navigator.vibrate(5);
        if (rawProgress > 0.6 && Math.random() > 0.5 && navigator.vibrate) navigator.vibrate(10);

        if (newPercentage >= 100) {
            setIsComplete(true);
            setIsHolding(false);
            if (navigator.vibrate) navigator.vibrate([50, 100, 200]);
            setTimeout(() => {
                onStart && onStart();
            }, 500); 
        } else {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    if (isHolding) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isHolding, isComplete, onStart]);

  // Shake effect on the whole container when holding near completion
  const shakeIntensity = isHolding ? Math.max(0, (progress - 60) / 10) : 0;
  const containerStyle = isHolding && progress > 60 ? {
      transform: `translate(${Math.random() * shakeIntensity - shakeIntensity/2}px, ${Math.random() * shakeIntensity - shakeIntensity/2}px)`
  } : {};

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-[#0A0E14] overflow-hidden z-50 select-none font-sans">
      
      {/* --- ATMOSPHERE LAYERS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Top Spotlight (Stadium Light) */}
          <div className={`absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150%] h-[100%] bg-gradient-to-b from-blue-900/20 via-transparent to-transparent blur-3xl transition-opacity duration-1000 ${isHolding ? 'opacity-80' : 'opacity-40'}`}></div>
          
          {/* Bottom Glow (Turf) */}
          <div className={`absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-green-900/10 blur-[100px] transition-all duration-700 ${isHolding ? 'opacity-60 scale-110' : 'opacity-20 scale-100'}`}></div>

          {/* Grid Floor */}
          <div 
            className={`absolute bottom-0 w-[200%] h-[100%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_100%)] left-[-50%] transition-transform duration-[2s] ease-in`}
            style={{ 
                transform: `perspective(500px) rotateX(60deg) translateY(${isHolding ? '200px' : '0px'}) translateZ(${progress * 2}px)`,
                opacity: 0.3 + (progress / 200)
            }}
          >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6" style={containerStyle}>
         
         {/* Brand / Identity */}
         <div className={`transition-all duration-500 flex flex-col items-center ${isHolding ? 'scale-110' : 'scale-100'}`}>
             <div className="flex items-center gap-1 mb-4">
                 <span className={`w-2 h-2 rounded-full ${isHolding ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                 <span className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase">
                     {isHolding ? 'SİSTEM AKTİF' : 'ECOSYSTEM V2.4'}
                 </span>
             </div>
             
             <h1 className="text-7xl font-black text-white tracking-tighter italic leading-none relative">
                 <span className="relative z-10">OYNA</span>
                 {/* Glitch/Shadow Copy */}
                 <span className={`absolute top-0 left-0 -z-10 text-[#FFFF00] opacity-0 transition-all duration-100 ${isHolding ? 'translate-x-1 translate-y-1 opacity-40 blur-sm' : ''}`}>OYNA</span>
             </h1>
             
             <div className={`h-1 w-full bg-gradient-to-r from-transparent via-[#FFFF00] to-transparent mt-2 transition-all duration-300 ${isHolding ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-[0px]'}`}></div>
         </div>

      </div>

      {/* --- INTERACTION ZONE --- */}
      <div className="relative z-20 pb-20 w-full flex flex-col items-center justify-center">
          
          {/* The Trigger */}
          <div 
            className="relative w-32 h-32 flex items-center justify-center cursor-pointer touch-none group"
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
          >
              {/* 1. Progress Ring (SVG) */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(255,255,0,0.3)]" viewBox="0 0 128 128">
                  {/* Track */}
                  <circle
                    cx="64" cy="64" r="60"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  {/* Fill Indicator */}
                  <circle
                    cx="64" cy="64" r="60"
                    stroke="#FFFF00"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * progress) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-75 ease-linear ${isHolding ? 'opacity-100' : 'opacity-0'}`}
                  />
              </svg>

              {/* 2. Core Button */}
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden
                  ${isHolding 
                      ? 'bg-[#FFFF00] scale-90 shadow-[0_0_60px_rgba(255,255,0,0.4)]' 
                      : 'bg-[#161B22] border border-white/10 hover:border-white/30 scale-100'}`}
              >
                  {/* Icon switching */}
                  <div className="relative z-10 transition-all duration-300">
                      {isHolding ? (
                          <Fingerprint size={40} className="text-black animate-pulse" />
                      ) : (
                          <Power size={32} className="text-white/50 group-hover:text-white transition-colors" />
                      )}
                  </div>
                  
                  {/* Inner Scan Effect */}
                  {!isHolding && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>}
              </div>

              {/* 3. Ripple Ring - Removed */}
          </div>
          
          {/* Status Text */}
          <div className="mt-8 text-center h-6 overflow-hidden">
              <div className={`transition-transform duration-300 flex flex-col items-center ${isHolding ? '-translate-y-6' : 'translate-y-0'}`}>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-4">GİRİŞ İÇİN BASILI TUT</p>
                  <p className="text-[10px] text-[#FFFF00] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Activity size={12} className="animate-bounce" /> KİMLİK DOĞRULANIYOR
                  </p>
              </div>
          </div>
      </div>

      {/* --- EXIT TRANSITION --- */}
      {/* Matches AuthScreen background color */}
      <div className={`absolute inset-0 bg-[#0A0E14] pointer-events-none transition-opacity duration-500 ease-in-out ${isComplete ? 'opacity-100' : 'opacity-0'} z-[60]`}>
          <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-full h-1 bg-[#FFFF00] transition-all duration-300 ${isComplete ? 'scale-x-100 opacity-0' : 'scale-x-0 opacity-100'}`}></div>
          </div>
      </div>

    </div>
  );
};

export default SplashScreen;
