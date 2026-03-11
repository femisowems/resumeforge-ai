"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const { resumeFile, setResumeFile, jobDescription, setJobDescription, startGeneration } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleForge = () => {
    startGeneration();
    router.push('/processing');
  }

  const isReady = resumeFile && jobDescription.trim().length > 50;

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 font-inter text-slate-200">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-outfit text-white">Upload Your Details</h1>
          <p className="text-slate-400">Provide your current resume and the target job description to start the forging process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-300 ml-1">Current Resume (PDF or DOCX)</label>
            {!resumeFile ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  aspect-square md:aspect-auto md:h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                  ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[0.98]' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx" 
                  className="hidden" 
                />
                <div className="bg-slate-800 p-4 rounded-2xl">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="text-center">
                  <p className="text-slate-200 font-medium">Click to upload</p>
                  <p className="text-slate-500 text-xs mt-1">or drag and drop here</p>
                </div>
              </div>
            ) : (
              <div className="md:h-64 p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/30 flex flex-col items-center justify-center gap-6 relative group">
                <button 
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-600/20">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-slate-200 font-bold max-w-[200px] truncate">{resumeFile.name}</p>
                  <p className="text-indigo-400 text-xs mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-300 ml-1">Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-inter text-sm leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <button 
            disabled={!isReady}
            onClick={handleForge}
            className={`
              flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl
              ${isReady 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 shadow-indigo-600/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
            `}
          >
            Forge Optimized Resume
            <Sparkles className={`w-6 h-6 ${isReady ? 'text-indigo-200 animate-pulse' : ''}`} />
          </button>
          
          <div className="flex items-center gap-8 text-xs text-slate-500 font-medium tracking-wide">
            <span className="flex items-center gap-2 uppercase"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ATS COMPLIANT</span>
            <span className="flex items-center gap-2 uppercase"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> GEMINI AI-POWERED</span>
            <span className="flex items-center gap-2 uppercase"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF EXPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
