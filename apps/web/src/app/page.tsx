"use client";

import React from 'react';
import { 
  FileText, Zap, BarChart3, Target, ChevronRight, 
  CheckCircle2, Cpu, Layout, Star, ArrowRight,
  ShieldCheck, Globe, Users, MessageSquare,
  HelpCircle, ChevronDown, Plus, Minus
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      q: "How does the AI optimize my resume?",
      a: "Our AI uses advanced Large Language Models to analyze your resume against specific job descriptions. It identifies keyword gaps, suggests structural improvements, and rephrases your experience to highlight the most relevant skills for that specific role."
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. We encrypt all data in transit and at rest. Your resumes are only used for generation and are never shared with third parties or used for training models without your explicit consent."
    },
    {
      q: "Can I export to PDF and Word?",
      a: "Yes! You can download your optimized resumes in high-quality PDF format. Word (DOCX) export is also supported for further manual editing."
    }
  ];

  return (
    <div className="flex flex-col w-full bg-slate-950 font-inter text-slate-200">
      <Navbar />

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-48 pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-slate-950">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Cpu className="w-4 h-4" />
              Next-Gen AI Resume Forging
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black font-outfit select-none leading-[1] tracking-tight text-white max-w-5xl mx-auto">
              Land Your Dream Job <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">
                In Half The Time
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              Join 50,000+ engineers using AI to beat the ATS and get hired at top tech companies. Upload once, optimize forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link 
                href="/upload"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl shadow-indigo-600/40 hover:-translate-y-1 active:scale-95 group"
              >
                Forge My Resume Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/examples"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-900 text-white border border-slate-800 px-10 py-5 rounded-2xl text-xl font-bold transition-all active:scale-95 group hover:border-indigo-500/50"
              >
                <Layout className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                View Examples
              </Link>
            </div>

            <div className="pt-20 flex flex-col items-center gap-8">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Trusted by engineers at</p>
              <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="text-3xl font-black font-outfit">Google</div>
                <div className="text-3xl font-black font-outfit">Meta</div>
                <div className="text-3xl font-black font-outfit">Apple</div>
                <div className="text-3xl font-black font-outfit">Amazon</div>
                <div className="text-3xl font-black font-outfit">Stripe</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Social Proof Stats --- */}
        <section className="py-20 border-y border-white/5 bg-slate-900/20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Resumes Forged", value: "500k+" },
              { label: "Interviews Secured", value: "120k+" },
              { label: "ATS Pass Rate", value: "98.4%" },
              { label: "Avg. Salary Increase", value: "32%" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-black text-white font-outfit">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-32 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-black font-outfit text-white leading-tight">Built for Competitive Engineering</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">Stop wasting hours on formatting. Our intelligent platform handles the heavy lifting so you can focus on the interview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Target className="w-8 h-8 text-indigo-400" />,
                  title: "ATS-Safe Engineering",
                  description: "Designed to navigate complex recruitment algorithms. We ensure your resume is readable by both bots and humans."
                },
                {
                  icon: <Zap className="w-8 h-8 text-purple-400" />,
                  title: "Sub-Minute Forging",
                  description: "Leveraging distributed AI pipelines to deliver a perfectly tailored resume in under 30 seconds."
                },
                {
                  icon: <BarChart3 className="w-8 h-8 text-indigo-400" />,
                  title: "Match Intelligence",
                  description: "Receive a deep-dive analysis of how your skills align with the JD, identifying critical gaps instantly."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
                  title: "Privacy First",
                  description: "Your data is yours. We use enterprise-grade encryption and never sell your professional history."
                },
                {
                  icon: <Globe className="w-8 h-8 text-blue-400" />,
                  title: "Global Standards",
                  description: "Optimized for tech markets in the US, Canada, Europe, and beyond. One tool for your global career."
                },
                {
                  icon: <MessageSquare className="w-8 h-8 text-pink-400" />,
                  title: "AI Writing Assistant",
                  description: "Struggling with bullet points? Our AI re-writes your achievements to maximize impact and action."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-900/30 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-3 hover:bg-slate-900/50">
                  <div className="bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-white/10 group-hover:scale-110 transition-transform group-hover:bg-indigo-600/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Templates Gallery Section --- */}
        <section className="py-32 px-6 bg-slate-900/10">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black font-outfit text-white">Premium Templates</h2>
                <p className="text-slate-400 text-lg max-w-xl leading-relaxed">Choose from 4 expertly designed layouts optimized for readability and impact.</p>
              </div>
              <Link href="/examples" className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
                Explore All Templates
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Classic", desc: "For traditional firms", color: "bg-blue-500" },
                { name: "Modern", desc: "Perfect for startups", color: "bg-indigo-500" },
                { name: "Minimalist", desc: "Clean & Effective", color: "bg-slate-500" },
                { name: "Executive", desc: "Leadership roles", color: "bg-purple-500" }
              ].map((template, idx) => (
                <div key={idx} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 z-10" />
                   <div className="absolute inset-0 flex items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                      <FileText className="w-24 h-24 text-slate-800" />
                   </div>
                   <div className="absolute bottom-8 left-8 right-8 z-20 space-y-1">
                      <h4 className="text-xl font-bold text-white">{template.name}</h4>
                      <p className="text-slate-400 text-sm">{template.desc}</p>
                   </div>
                   <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${template.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Testimonials --- */}
        <section className="py-32 px-6 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center">
              <h2 className="text-4xl font-black font-outfit text-white">Success Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah J.", role: "Software Engineer @ Google", text: "ResumeForge AI helped me tailor my resume for Google in minutes. I landed an interview the following week and ultimately got the offer!" },
                { name: "Michael K.", role: "Backend Developer", text: "The match score is a game-changer. It clearly showed me what was missing from my profile. Highly recommend for any dev looking to level up." },
                { name: "Elena R.", role: "Staff Engineer @ Stripe", text: "Clean, professional, and actually works. The templates are the best I've seen in the market for tech roles." }
              ].map((t, i) => (
                <div key={i} className="p-10 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 relative">
                  <Star className="w-8 h-8 text-indigo-500/20 absolute top-8 right-10" />
                  <p className="text-slate-300 italic mb-8 leading-relaxed text-lg">"{t.text}"</p>
                  <div>
                    <h5 className="font-bold text-white">{t.name}</h5>
                    <p className="text-slate-500 text-sm">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* --- FAQ Section --- */}
        <section id="faq" className="py-32 px-6 bg-slate-950">
          <div className="max-w-3xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black font-outfit text-white tracking-tight">Got Questions?</h2>
              <p className="text-slate-400">Everything you need to know about ResumeForge AI.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-3xl border border-white/5 bg-slate-900/30 overflow-hidden group transition-all hover:bg-slate-900/50">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-8 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-bold text-white">{faq.q}</span>
                    <div className={`p-2 rounded-full transition-all ${openFaq === i ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-800 text-slate-500 group-hover:text-white'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-5xl mx-auto p-16 md:p-32 rounded-[4rem] bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-7xl font-black font-outfit text-white leading-[1.1]">Your Next Big Role <br /> Starts Here</h2>
              <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">Stop sending resumes that get ignored. Forge a professional profile that gets you hired.</p>
              
              <Link 
                href="/upload"
                className="inline-flex items-center gap-4 bg-white text-slate-950 px-12 py-6 rounded-3xl text-2xl font-black hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
              >
                Get Started For Free
                <Zap className="w-8 h-8 fill-current" />
              </Link>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest pt-4">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> 2 Free Credits</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> No Credit Card Required</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Secure & Private</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
