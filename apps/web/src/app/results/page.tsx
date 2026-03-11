"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Download, Copy, RefreshCw, Check, ArrowLeft, Star, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const { matchScore, reset } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 text-slate-200 font-inter">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <button 
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Start
            </button>
            <h1 className="text-4xl font-bold font-outfit text-white">Your Optimized Resume is Ready</h1>
            <p className="text-slate-400">Forged with precision for maximum ATS compatibility.</p>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="40" cy="40" r="36" 
                  className="stroke-slate-800 fill-none" 
                  strokeWidth="8"
                />
                <circle 
                  cx="40" cy="40" r="36" 
                  className="stroke-indigo-500 fill-none transition-all duration-1000" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - (matchScore || 85) / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-bold font-outfit text-white">{matchScore || 85}%</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ATS MATCH SCORE</p>
              <p className="text-sm text-slate-400 font-medium">Highly Competitive</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Preview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden min-h-[800px] p-12 text-slate-900 border border-slate-200">
              {/* Mock Resume Content with premium styling */}
              <div className="space-y-8 max-w-2xl mx-auto font-inter">
                <div className="text-center space-y-2 pb-8 border-b border-slate-100">
                  <h2 className="text-4xl font-black tracking-tight">ALEX FORGER</h2>
                  <p className="text-indigo-600 font-bold tracking-widest text-xs uppercase">Senior Full Stack Engineer</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pb-1 border-b-2 border-slate-900 inline-block">Professional Summary</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Innovative software engineer with 8+ years of experience specializing in high-performance cloud architectures. Proven track record of optimizing system latency by 45% and leading cross-functional teams to deliver scalable AI-powered solutions.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pb-1 border-b-2 border-slate-900 inline-block">Key Expertise</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["React & Next.js", "Ruby on Rails", "PostgreSQL", "AWS Infrastructure", "AI Integration"].map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-700">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pb-1 border-b-2 border-slate-900 inline-block">Experience Highlights</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold">Lead Engineer @ TechNova Solutions</h4>
                      <p className="text-xs text-slate-400 mb-2">2021 — PRESENT</p>
                      <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                        <li>Architected a real-time data ingestion pipeline processing 10M+ events daily.</li>
                        <li>Implemented an AI-driven predictive maintenance engine reducing downtime by 30%.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Insights */}
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl font-bold transition-all active:scale-95"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-400" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-400 p-4 rounded-2xl font-bold transition-all active:scale-95">
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                AI Insights
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our AI significantly improved the metrics and quantifiable achievements in your "Lead Engineer" role to better align with the job's requirement for scalability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
