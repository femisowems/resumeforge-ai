"use client";

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProcessingPage() {
  const router = useRouter();
  const { isGenerating, generatedResumeId, generationStep, pollJobStatus } = useAppStore();

  useEffect(() => {
    if (!isGenerating) {
      router.push('/');
      return;
    }

    if (!generatedResumeId) return;

    const interval = setInterval(() => {
      pollJobStatus(generatedResumeId);
    }, 2000);

    return () => clearInterval(interval);
  }, [isGenerating, generatedResumeId, pollJobStatus, router]);

  // Navigate when done
  useEffect(() => {
    if (generationStep === 'completed') {
      router.push('/results');
    }
  }, [generationStep, router]);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 font-inter flex flex-col items-center justify-center">
      <div className="text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-outfit text-white">Forging Your Resume</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Our AI is analyzing the job description and optimizing your resume for maximum impact. This usually takes 10-30 seconds.
          </p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3 max-w-sm mx-auto text-left pt-8">
          <div className="flex items-center gap-3 text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Parsing document structure...</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-4 h-4 rounded-full border-2 border-slate-700" />
            <span className="text-sm font-medium">Extracting key requirements...</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-4 h-4 rounded-full border-2 border-slate-700" />
            <span className="text-sm font-medium">Optimizing keywords...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
