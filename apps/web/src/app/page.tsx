"use client";

import React from 'react';
import { FileText, Zap, BarChart3, Target, ChevronRight, CheckCircle2, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/upload');
  };

  return (
    <div className="flex flex-col w-full bg-slate-950 font-inter text-slate-200">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-slate-950">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <Cpu className="w-3 h-3" />
            AI-POWERED OPTIMIZATION
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-outfit select-none leading-[1.1] tracking-tight text-white max-w-4xl mx-auto">
            Forge Your Career Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">
              In Seconds
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate high-converting, job-tailored resumes that beat the ATS system. Upload your current resume and a job description, and let our AI do the heavy lifting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-2xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95"
            >
              Generate My Resume
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 text-white border border-slate-800 px-8 py-4 rounded-2xl text-lg font-bold transition-all active:scale-95">
              View Examples
            </button>
          </div>

          <div className="pt-16 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-bold font-outfit text-slate-500">Google</div>
             <div className="text-2xl font-bold font-outfit text-slate-500">Meta</div>
             <div className="text-2xl font-bold font-outfit text-slate-500">Apple</div>
             <div className="text-2xl font-bold font-outfit text-slate-500">Amazon</div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">Advanced AI Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built with state-of-the-art LLMs to ensure your resume stands out to recruiters and machines alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6 text-indigo-400" />,
                title: "ATS Optimization",
                description: "Automatically injects relevant keywords and ensures structural compliance with modern Applicant Tracking Systems."
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-400" />,
                title: "Instant Generation",
                description: "From raw PDF to a polished, professional resume in under 30 seconds using our distributed worker pipeline."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-indigo-400" />,
                title: "Match Scoring",
                description: "Get a real-time score indicating how well your resume matches the job description before you apply."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-2">
                <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">Three Steps to Your Dream Job</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Upload Your Content", text: "Upload your existing resume in PDF or DOCX format. No re-typing required." },
                { step: "02", title: "Paste Job Link", text: "Paste the job description you're targeting. Our AI analyzes the core requirements." },
                { step: "03", title: "Forge & Download", text: "Click generate and receive a perfectly tailored resume in a premium PDF format." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="text-4xl font-black text-indigo-900/40 font-outfit">{item.step}</div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-3xl blur-3xl -z-10" />
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="w-full h-full bg-slate-800/50 rounded-2xl flex items-center justify-center animate-pulse">
                <FileText className="w-16 h-16 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/50 border border-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6">Ready to stand out?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">Join thousands of job seekers who landed interviews at top tech companies using ResumeForge AI.</p>
          
          <button 
            onClick={handleGetStarted}
            className="flex items-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl mx-auto"
          >
            Get Started Free
            <Zap className="w-5 h-5 fill-current" />
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Credit Card</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2 Free Credits</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF Export</span>
          </div>
        </div>
      </section>
    </div>
  );
}
