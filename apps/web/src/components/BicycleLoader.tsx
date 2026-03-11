"use client";

import React from 'react';

interface BicycleLoaderProps {
  progress: number;
}

export const BicycleLoader: React.FC<BicycleLoaderProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      {/* Bicycle Animation Container */}
      <div className="relative w-48 h-32 flex items-end justify-center">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-pulse" />
        
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes wheel-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pedal-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes leg-top-move {
              0%, 100% { transform: rotate(-20deg); }
              50% { transform: rotate(20deg); }
            }
            @keyframes leg-bottom-move {
              0%, 100% { transform: rotate(40deg); }
              50% { transform: rotate(-10deg); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            @keyframes road-move {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -20; }
            }
            .wheel { 
              transform-origin: center;
              animation: wheel-rotate 1s linear infinite;
            }
            .spoke { stroke: #6366f1; stroke-width: 0.5; }
            .bicycle-frame { fill: none; stroke: #94a3b8; stroke-width: 1.5; stroke-linecap: round; }
            .pedal-system { 
              transform-origin: 50px 45px;
              animation: pedal-rotate 1s linear infinite;
            }
            .rider-body { 
              animation: bounce 0.5s ease-in-out infinite;
              transform-origin: bottom;
            }
            .leg-top {
              transform-origin: 50px 32px;
              animation: leg-top-move 1s ease-in-out infinite;
            }
            .leg-bottom {
              transform-origin: 50px 42px;
              animation: leg-bottom-move 1s ease-in-out infinite;
            }
            .road {
              stroke: #334155;
              stroke-width: 1;
              stroke-dasharray: 4 16;
              animation: road-move 0.5s linear infinite;
            }
          `}</style>

          {/* Road */}
          <line x1="10" y1="58" x2="90" y2="58" className="road" />

          {/* Bicycle Frame */}
          <g className="bicycle-frame">
            <path d="M30 45 L50 45 L65 30 L45 30 Z" /> {/* Main Triangle */}
            <path d="M50 45 L50 32" /> {/* Seat Post */}
            <path d="M65 30 L70 45" /> {/* Fork */}
            <path d="M48 32 L52 32" strokeWidth="2" /> {/* Seat */}
            <path d="M68 28 L74 28" strokeWidth="2" /> {/* Handlebars */}
          </g>

          {/* Back Wheel */}
          <g className="wheel" style={{ transformBox: 'fill-box' }}>
            <circle cx="30" cy="45" r="10" fill="none" stroke="#475569" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="40" y2="45" className="spoke" />
            <line x1="30" y1="35" x2="30" y2="55" className="spoke" />
            <line x1="23" y1="38" x2="37" y2="52" className="spoke" />
            <line x1="23" y1="52" x2="37" y2="38" className="spoke" />
          </g>

          {/* Front Wheel */}
          <g className="wheel" style={{ transformBox: 'fill-box' }}>
            <circle cx="70" cy="45" r="10" fill="none" stroke="#475569" strokeWidth="1.5" />
            <line x1="60" y1="45" x2="80" y2="45" className="spoke" />
            <line x1="70" y1="35" x2="70" y2="55" className="spoke" />
            <line x1="63" y1="38" x2="77" y2="52" className="spoke" />
            <line x1="63" y1="52" x2="77" y2="38" className="spoke" />
          </g>

          {/* Rider */}
          <g className="rider-body">
            {/* Torso & Head */}
            <circle cx="50" cy="20" r="4" fill="#6366f1" /> {/* Head */}
            <path d="M50 24 L50 32 L40 28" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" /> {/* Torso & Arm */}
            
            {/* Legs - Simplified pedaling */}
            <g className="leg-top">
              <line x1="50" y1="32" x2="50" y2="42" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          {/* Pedals */}
          <g className="pedal-system" style={{ transformBox: 'fill-box' }}>
            <circle cx="50" cy="45" r="2" fill="#94a3b8" />
            <line x1="50" y1="45" x2="50" y2="50" stroke="#94a3b8" strokeWidth="1" />
            <rect x="47" y="50" width="6" height="1" fill="#475569" />
          </g>
        </svg>
      </div>

      {/* Status & Progress */}
      <div className="w-full space-y-4">
        <div className="space-y-1 text-center">
          <h3 className="text-xl font-bold text-white font-outfit tracking-tight">Forging in Progress</h3>
          <p className="text-indigo-400 text-sm font-medium animate-pulse">
            {progress < 30 ? 'Analyzing resume...' : progress < 70 ? 'Tailoring keywords...' : 'Polishing final draft...'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm relative">
            {/* Glow beneath bar */}
            <div 
              className="absolute inset-y-0 left-0 bg-indigo-500/20 blur-md transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out relative z-10"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/10 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Standard Mode
            </span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              {Math.floor(progress)}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
