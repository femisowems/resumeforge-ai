"use client";

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProcessingPage() {
  const router = useRouter();
  const { isGenerating, generatedResumeId, generationStep, pollJobStatus } = useAppStore();
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    if (!isGenerating) {
      router.push('/');
      return;
    }

    if (!generatedResumeId) return;

    // Simulate progress from 0% to 95% over ~20 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        // Slow down the progress as it gets higher
        const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 1000);

    const pollInterval = setInterval(() => {
      pollJobStatus(generatedResumeId);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [isGenerating, generatedResumeId, pollJobStatus, router]);

  // Navigate when done
  useEffect(() => {
    if (generationStep === 'completed') {
      setProgress(100);
      setTimeout(() => router.push('/results'), 400); // tiny delay for visual completion
    }
  }, [generationStep, router]);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 font-inter flex flex-col items-center justify-center">
      <div className="text-center space-y-8 animate-in fade-in duration-700 w-full max-w-lg mx-auto">
        
        {/* Animated Bicycle Girl Illustration */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center animate-[bounce_2s_infinite]">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
          <img 
            src="/animated_bicycle_girl.png" 
            alt="AI is working..." 
            className="w-full h-full object-contain relative z-10 rounded-full scale-110 shadow-2xl shadow-indigo-500/30"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-outfit text-white">Forging Your Resume</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Our AI is pedaling hard to analyze the job description and optimize your resume for maximum impact. This usually takes 10-30 seconds.
          </p>
        </div>

        {/* Progress Bar & Timer UI */}
        <div className="pt-6 w-full max-w-sm mx-auto space-y-3">
          <div className="flex justify-between items-center text-xs font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              {progress < 30 ? 'Parsing document...' : progress < 70 ? 'Extracting requirements...' : 'Optimizing keywords...'}
            </span>
            <span className="text-indigo-400 tabular-nums">{Math.floor(progress)}%</span>
          </div>
          
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-30 animate-[slide_1s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
