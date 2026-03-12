"use client";

import React from 'react';
import { Download, ChevronLeft, ChevronRight, FileText, Layout, Palette, Zap, ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

// --- Sample Data ---
const SAMPLE_RESUME = `
# Alex Carter
Senior Full Stack Engineer
San Francisco, CA • alex.carter@example.com • linkedin.com/in/alexcarter • alexcarter.dev

### Professional Summary
A results-driven Senior Full Stack Engineer with over 8 years of experience in building scalable web applications and high-performance distributed systems. Proven track record of leading cross-functional teams to deliver high-impact features and optimizing development workflows. Expert in modern JavaScript frameworks, cloud architecture, and AI-driven optimization.

### Core Competencies
- **Languages**: TypeScript, JavaScript, Go, Python, SQL, HTML5, CSS3
- **Frontend**: React, Next.js, Tailwind CSS, Zustand, TipTap, Framer Motion
- **Backend/Cloud**: Node.js, NestJS, PostgreSQL, Redis, AWS (S3, Lambda, RDS), Docker
- **AI/ML**: Google Gemini API, OpenAI GPT-4, Vector Databases, Prompt Engineering
- **Engineering Tools**: Git, CI/CD (GitHub Actions), Agile/Scrum, Jest, Cypress

### Professional Experience

#### **ForgeTech Systems** | Lead Full Stack Engineer
*San Francisco, CA | Jan 2021 – Present*

- **Platform Architecture**: Spearheaded the migration of a legacy monolithic architecture to a modern microservices-based system, resulting in a **45% increase in system reliability** and faster deployment cycles.
- **AI Integration**: Architected and implemented an AI-driven resume optimization engine using **Google Gemini API**, reducing manual editing time for users by **70%**.
- **Performance Tuning**: Optimized database queries and implemented advanced caching strategies with Redis, reducing average API response times from **800ms to under 150ms**.
- **Leadership**: Mentor a team of 6 engineers, conducting code reviews and technical workshops to foster a culture of excellence and continuous learning.

#### **GlobalStream Media** | Senior Web Engineer
*New York, NY | May 2018 – Dec 2020*

- **Real-time Engine**: Designed and developed a real-time analytics dashboard for streaming services, handling over **1M+ concurrent users** during peak events.
- **UI/UX Revolution**: Led the redesign of the core user interface using a custom Tailwind-based design system, improving user engagement metrics by **25%**.
- **Automated Testing**: Established a comprehensive testing strategy using Jest and Cypress, achieving **90% code coverage** and reducing production bugs by **35%**.

#### **Pioneer Labs** | Full Stack Developer
*Austin, TX | June 2015 – April 2018*

- **Cloud Migration**: Successfully migrated over 100TB of on-premise data to AWS S3 and RDS with zero downtime.
- **Feature Delivery**: Developed and launched a collaborative real-time editing feature using WebSockets, gaining **50,000+ active monthly users** within the first quarter.
- **API Design**: Built and maintained robust RESTful APIs providing data to both web and mobile client applications.

### Education

#### **Stanford University**
*Bachelor of Science in Computer Science*

### Honors & Projects
- **Open Source Contributor**: Active contributor to major React-based open-source libraries.
- **Tech Speaker**: Frequent speaker at local engineering meetups on AI and Scalable Architecture.
- **Innovation Award**: Winner of the "Scale-Up 2022" Hackathon for a unique distributed logging solution.
`;

// --- Template Components (reusing the refined 2-page spacing) ---

const classicTemplate: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-3 mb-3" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#0f172a' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-[13px] font-medium mb-8" style={{ color: '#64748b', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-10 mb-4 border-b-2" style={{ borderColor: '#e2e8f0', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-sm font-bold uppercase tracking-widest pb-1.5" style={{ color: '#0f172a' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-semibold text-[15px] mt-6 mb-2" style={{ color: '#1e293b', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] leading-[1.7] mb-4" style={{ color: '#334155', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#334155', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] leading-[1.7]" style={{ color: '#334155', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#334155', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
};

const modernTemplate: Components = {
  h1: ({ children }) => (
    <div className="pb-3 mb-3" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#0ea5e9', fontFamily: 'sans-serif' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-[14px] font-bold mb-8 uppercase tracking-wider" style={{ color: '#94a3b8', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-10 mb-5 border-l-4 pl-3" style={{ borderColor: '#0ea5e9', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-bold text-[15px] mt-6 mb-2" style={{ color: '#0f172a', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13.5px] leading-[1.8] mb-4" style={{ color: '#475569', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#475569', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13.5px] leading-[1.8]" style={{ color: '#475569', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#475569', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
};

const minimalistTemplate: Components = {
  h1: ({ children }) => (
    <div className="pb-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-xl font-bold tracking-wide" style={{ color: '#333333' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-[12px] mb-10" style={{ color: '#666666', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-10 mb-5" style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.3em] pb-3 border-b" style={{ color: '#333333', borderColor: '#eaeaea' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-medium text-[14px] mt-6 mb-2" style={{ color: '#333333', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] leading-[2] mb-4" style={{ color: '#555555', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-3 mb-6" style={{ color: '#555555', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] leading-[2]" style={{ color: '#555555', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-3 mb-6" style={{ color: '#555555', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#111111' }}>{children}</strong>
  ),
};

const executiveTemplate: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-3 mb-3" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold font-serif" style={{ color: '#000000', fontFamily: 'serif' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-[13px] font-serif mb-8" style={{ color: '#333333', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-10 mb-4 border-b-[3px]" style={{ borderColor: '#000000', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-sm font-bold font-sans uppercase tracking-widest pb-2" style={{ color: '#000000' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-bold font-serif text-[15px] mt-6 mb-2" style={{ color: '#000000', fontFamily: 'serif', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] font-serif leading-[1.75] mb-4" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] font-serif leading-[1.75]" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-2.5 mb-6" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#000000' }}>{children}</strong>
  ),
};

const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'Traditional & Professional', components: classicTemplate },
  { id: 'modern', name: 'Modern', description: 'Clean & Contemporary', components: modernTemplate },
  { id: 'minimalist', name: 'Minimalist', description: 'Sleek & Elegant', components: minimalistTemplate },
  { id: 'executive', name: 'Executive', description: 'Prestigious & Impactful', components: executiveTemplate }
];

export default function ExamplesPage() {
  const router = useRouter();
  const [activeTemplateIndex, setActiveTemplateIndex] = React.useState(0);
  const activeTemplate = TEMPLATES[activeTemplateIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-inter flex flex-col">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-700" />
          <h1 className="text-lg font-bold font-outfit text-white tracking-tight">Resume Examples</h1>
        </div>

        <Link 
          href="/upload"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          Create My Resume
          <Zap className="w-4 h-4 fill-current" />
        </Link>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar - Template Selection */}
        <div className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/30 p-6 overflow-y-auto shrink-0">
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Choose a Template</h2>
              <div className="space-y-3">
                {TEMPLATES.map((template, idx) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplateIndex(idx)}
                    className={`w-full flex flex-col items-start p-4 rounded-2xl border transition-all hover:bg-slate-800/50 ${
                      activeTemplateIndex === idx 
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-sm font-bold ${activeTemplateIndex === idx ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {template.name}
                      </span>
                      {activeTemplateIndex === idx && <Star className="w-4 h-4 text-indigo-400 fill-current" />}
                    </div>
                    <span className="text-xs text-slate-500">{template.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20">
              <h3 className="text-sm font-bold text-white mb-2">Why these templates?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Expertly crafted to pass through **ATS systems** while impressing human recruiters. Tested across 100+ job categories.
              </p>
            </div>
          </div>
        </div>

        {/* Main Workspace - Resume Preview */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl w-full flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-outfit text-white">Full Stack Engineer Preview</h2>
              <p className="text-slate-400">See how our AI formats a top-tier tech resume in the <span className="text-indigo-400 font-bold">{activeTemplate.name}</span> style.</p>
            </div>

            {/* Resume "Sheet" */}
            <div className="relative group mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              
              <div className="relative bg-white shadow-2xl rounded-sm w-full max-w-[816px] min-h-[1056px] p-[0.75in] lg:p-[1in] overflow-hidden">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={activeTemplate.components}
                >
                  {SAMPLE_RESUME}
                </ReactMarkdown>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-white mb-6">Ready to build your own version?</h3>
              <Link 
                href="/upload"
                className="inline-flex items-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started Now
                <Zap className="w-5 h-5 fill-current" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}
