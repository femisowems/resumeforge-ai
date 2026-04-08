"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const JOB_TEMPLATES = [
  {
    label: "Amazon SDE",
    value: "Company: Amazon\nRole: Software Development Engineer\nLocation: Canada\nSalary Range:  Canada 89,700 - 149,800 CAD\n\nDescription: Amazon is seeking Software Development Engineers to build scalable distributed systems that power millions of customer interactions globally. Engineers at Amazon design, develop, and operate services that support Amazon’s vast infrastructure. You will collaborate with cross-functional teams to build highly reliable systems while owning the full lifecycle of your code from design to deployment.\n\nResponsibilities:\n- Design and develop scalable cloud-based services\n- Build resilient distributed systems\n- Participate in code reviews and technical design discussions\n- Write clean, maintainable code following engineering best practices\n- Work in an agile development environment\n- Monitor production systems and resolve operational issues\n\nBasic Qualifications:\n- Experience with a programming language such as Java, Python, C++, Go, Rust, or TypeScript\n- Understanding of data structures and algorithms\n- Experience with object-oriented programming principles\n\nPreferred Qualifications:\n- Experience building distributed systems\n- Experience with AWS cloud services\n- Experience with CI/CD pipelines\n- Strong problem solving and communication skills"
  },
  {
    label: "Google Frontend",
    value: "Company: Google\nRole: Frontend Software Engineer\nLocation: Toronto, Canada\nSalary Range: 120,000 - 180,000 CAD\n\nDescription: Google is looking for Frontend Engineers to build intuitive and performant user interfaces used by billions of users worldwide. You will collaborate closely with designers and backend engineers to develop scalable web applications while ensuring accessibility, performance, and maintainability.\n\nResponsibilities:\n- Build scalable and reusable frontend components\n- Improve application performance and responsiveness\n- Collaborate with designers to implement pixel-perfect interfaces\n- Ensure cross-browser compatibility and accessibility\n- Participate in code reviews and technical discussions\n- Write maintainable and testable code\n\nBasic Qualifications:\n- Strong proficiency with JavaScript or TypeScript\n- Experience with modern frontend frameworks such as React or Angular\n- Understanding of web performance and browser rendering\n\nPreferred Qualifications:\n- Experience with large-scale frontend architectures\n- Experience with state management libraries\n- Experience with accessibility and performance optimization\n- Strong UX and product thinking"
  },
  {
    label: "Meta PM",
    value: "Company: Meta\nRole: Product Manager\nLocation: Remote / North America\nSalary Range: 130,000 - 200,000 CAD\n\nDescription: Meta is looking for Product Managers to lead the development of products that connect billions of people around the world. Product Managers work closely with engineering, design, and data teams to define product strategy, prioritize features, and deliver impactful user experiences.\n\nResponsibilities:\n- Define product vision and strategy\n- Collaborate with engineering and design teams to build products\n- Prioritize product roadmap based on user needs and data insights\n- Analyze metrics and improve product performance\n- Communicate product updates across stakeholders\n\nBasic Qualifications:\n- Experience working with engineering teams on software products\n- Strong analytical and problem solving skills\n- Excellent written and verbal communication\n\nPreferred Qualifications:\n- Experience leading cross-functional product teams\n- Experience with data-driven decision making\n- Experience shipping consumer-facing products"
  },
  {
    label: "Apple iOS",
    value: "Company: Apple\nRole: iOS Software Engineer\nLocation: Vancouver, Canada\nSalary Range: 110,000 - 170,000 CAD\n\nDescription: Apple is seeking iOS Engineers to build elegant and intuitive applications that deliver world-class user experiences across Apple devices. You will collaborate with product designers and backend engineers to develop highly polished mobile applications used by millions of users.\n\nResponsibilities:\n- Develop high quality iOS applications using Swift\n- Collaborate with design and product teams\n- Write maintainable and well tested code\n- Improve application performance and stability\n- Participate in code reviews and technical discussions\n\nBasic Qualifications:\n- Experience with Swift or Objective-C\n- Experience building iOS applications\n- Strong understanding of mobile application architecture\n\nPreferred Qualifications:\n- Experience with SwiftUI\n- Experience with REST APIs\n- Experience optimizing mobile performance"
  },
  {
    label: "Stripe Backend",
    value: "Company: Stripe\nRole: Backend Software Engineer\nLocation: Remote\nSalary Range: 140,000 - 210,000 CAD\n\nDescription: Stripe is looking for Backend Engineers to build financial infrastructure used by millions of businesses worldwide. Engineers work on highly reliable APIs and services that power online payments, financial operations, and global commerce.\n\nResponsibilities:\n- Design and implement backend services and APIs\n- Ensure reliability and scalability of financial systems\n- Collaborate with product and infrastructure teams\n- Write well tested and maintainable code\n- Monitor production systems and improve reliability\n\nBasic Qualifications:\n- Experience with backend programming languages such as Ruby, Go, or Java\n- Experience designing APIs\n- Strong understanding of distributed systems\n\nPreferred Qualifications:\n- Experience building financial or payments systems\n- Experience with cloud infrastructure\n- Experience scaling production systems"
  },
  {
    label: "Netflix Fullstack",
    value: "Company: Netflix\nRole: Full Stack Software Engineer\nLocation: Remote\nSalary Range: 150,000 - 220,000 CAD\n\nDescription: Netflix is looking for Full Stack Engineers to build and maintain applications that power the global streaming platform. Engineers work across frontend and backend systems to deliver seamless user experiences at massive scale.\n\nResponsibilities:\n- Develop full stack applications supporting streaming services\n- Build scalable backend services and APIs\n- Improve frontend performance and usability\n- Collaborate with design and product teams\n- Maintain high reliability and performance\n\nBasic Qualifications:\n- Experience with JavaScript or TypeScript\n- Experience with React or similar frameworks\n- Experience building backend services\n\nPreferred Qualifications:\n- Experience with cloud platforms\n- Experience building highly scalable systems\n- Strong product and UX awareness"
  }
];

export default function UploadPage() {
  const router = useRouter();
  const { 
    resumeFile, setResumeFile, 
    pastedResumeText, setPastedResumeText, 
    jobDescription, setJobDescription, 
    startGeneration, isGenerating, 
    generationStep, pollJobStatus,
    generatedResumeId, currentWarning,
    preferredAiProvider, setPreferredAiProvider
  } = useAppStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [resumeInputType, setResumeInputType] = useState<'upload' | 'paste'>('upload');
  const [progress, setProgress] = React.useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll for completion if generating
  React.useEffect(() => {
    if (!isGenerating || !generatedResumeId || generationStep === 'completed' || generationStep === 'failed') return;

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
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
  }, [isGenerating, generatedResumeId, pollJobStatus, generationStep]);

  // Navigate when done
  React.useEffect(() => {
    if (generationStep === 'completed') {
      setProgress(100);
      const timer = setTimeout(() => {
        router.push('/results');
      }, 1000); // 1s delay to show 100% and finish animation
      return () => clearTimeout(timer);
    }
    
    if (generationStep === 'failed') {
      const { error } = useAppStore.getState();
      toast.error(error || "Generation failed. Please try again with different inputs.");
    }
  }, [generationStep, router]);

  // Show warnings (fallback triggers)
  React.useEffect(() => {
    if (currentWarning) {
      toast.error(currentWarning, {
        icon: '⚠️',
        duration: 5000,
      });
    }
  }, [currentWarning]);

  // Global paste listener — works anywhere on the page
  React.useEffect(() => {
    if (resumeInputType !== 'upload') return;

    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept if the user is typing in a textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            setResumeFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [resumeInputType, setResumeFile]);

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

  const handlePasteFile = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) { setResumeFile(file); break; }
      }
    }
  };

  const handleForge = () => {
    startGeneration();
  }

  const isReady = (resumeFile || pastedResumeText.trim().length > 100) && jobDescription.trim().length > 50 && !isGenerating;

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 font-inter text-slate-200 relative overflow-hidden">
      <div className={`max-w-4xl mx-auto space-y-12 transition-all duration-700 ${isGenerating ? 'blur-sm grayscale opacity-30 pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-outfit text-white">Upload Your Details</h1>
          <p className="text-slate-400">Provide your current resume and the target job description to start the forging process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Current Resume</label>
              <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => setResumeInputType('upload')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${resumeInputType === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  FILE
                </button>
                <button 
                  onClick={() => setResumeInputType('paste')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${resumeInputType === 'paste' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  PASTE
                </button>
              </div>
            </div>

            {resumeInputType === 'upload' ? (
              !resumeFile ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onPaste={handlePasteFile}
                  tabIndex={0}
                  className={`
                    md:h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all outline-none focus:border-indigo-500/50
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
                    <p className="text-slate-500 text-xs mt-1">or drag &amp; drop, or paste a file here</p>
                  </div>
                </div>
              ) : (
                <div className="md:h-64 p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/30 flex flex-col items-center justify-center gap-6 relative group transform transition-all hover:scale-[1.01]">
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
              )
            ) : (
              <textarea 
                value={pastedResumeText}
                onChange={(e) => setPastedResumeText(e.target.value)}
                placeholder="Paste your current resume text here..."
                className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-inter text-sm leading-relaxed"
              />
            )}
          </div>

          {/* Job Description Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-300 md:h-[26px] flex items-center">Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none font-inter text-sm leading-relaxed"
            />
            <div className="flex flex-wrap justify-center items-center gap-2 pt-1">
              {JOB_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  onClick={() => setJobDescription(template.value)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50"
                  type="button"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Model Selector */}
        <div className="max-w-xl mx-auto space-y-4">
          <label className="block text-sm font-semibold text-slate-300 text-center">Select AI Engine</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            {[
              { id: 'auto', label: 'Auto (Fastest)' },
              { id: 'openai', label: 'OpenAI (GPT-4o)' },
              { id: 'anthropic', label: 'Anthropic (Claude)' },
              { id: 'google', label: 'Google (Gemini)' },
            ].map(provider => (
              <button
                key={provider.id}
                onClick={() => setPreferredAiProvider(provider.id)}
                className={`
                  py-2.5 px-3 rounded-xl text-xs font-bold transition-all
                  ${preferredAiProvider === provider.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}
                `}
              >
                {provider.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col items-center gap-6">
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

      {/* Premium Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] animate-bounce duration-[10s]" />
          
          <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 duration-500 ring-1 ring-white/10">
            <div className="relative w-32 h-32 mx-auto">
              {/* Outer rotating ring */}
               <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500/30 animate-[spin_3s_linear_infinite]" />
               <div className="absolute inset-2 rounded-full border-b-2 border-indigo-400/20 animate-[spin_2s_linear_infinite_reverse]" />
               
              <div className="absolute inset-4 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative z-10 w-full h-full bg-slate-800/50 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                <Loader2 className="w-12 h-12 text-indigo-400 animate-[spin_1.5s_linear_infinite]" />
                <Sparkles className="absolute top-6 right-6 w-4 h-4 text-indigo-300/50 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white font-outfit tracking-tight">Forging Your Resume</h3>
              <p className="text-slate-400 text-sm font-medium h-5">
                {progress < 30 ? 'Analyzing professional profile...' : progress < 60 ? 'Tailoring to job requirements...' : progress < 90 ? 'Optimizing for ATS systems...' : 'Finalizing draft...'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  Processing
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {Math.floor(progress)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
