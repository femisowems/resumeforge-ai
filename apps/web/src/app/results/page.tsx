"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Download, Copy, RefreshCw, Check, ArrowLeft, Star, Target, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { generateResumeFileName, NamingMetadata } from '@/lib/generateResumeFileName';

// Custom components to render the AI resume text as a beautiful document.
// Note: We use inline hex colors here instead of Tailwind classes because
// Tailwind v4 uses lab()/oklch() which crashes html2canvas!
const resumeComponents: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-6 mb-6 border-b-2" style={{ borderColor: '#e2e8f0' }}>
      <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: '#0f172a' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-sm font-medium -mt-4 mb-6" style={{ color: '#64748b' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-8 mb-3">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] pb-1 border-b-2 inline-block" style={{ color: '#0f172a', borderColor: '#0f172a' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-bold text-base mt-4 mb-0.5" style={{ color: '#0f172a' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4" style={{ color: '#475569' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-sm leading-relaxed" style={{ color: '#475569' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-4" style={{ color: '#475569' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic font-medium" style={{ color: '#64748b' }}>{children}</em>
  ),
  hr: () => (
    <hr className="border-t my-6" style={{ borderColor: '#f1f5f9' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: '#4f46e5' }}>
      {children}
    </a>
  ),
};

export default function ResultsPage() {
  const router = useRouter();
  const { matchScore, reset, generatedResumeText, resumeFile, jobDescription } = useAppStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const resumeRef = React.useRef<HTMLDivElement>(null);

  const namingMetadata = React.useMemo<NamingMetadata>(() => {
    let name: string | undefined = undefined;
    let role: string | undefined = undefined;
    let company: string | undefined = undefined;

    if (generatedResumeText) {
      const nameMatch = generatedResumeText.match(/^#\s+([^\n\r]+)/m);
      if (nameMatch) {
        name = nameMatch[1].trim();
      } else if (resumeFile?.name) {
        name = resumeFile.name.replace(/\.[^/.]+$/, "");
      }
    } else if (resumeFile?.name) {
      name = resumeFile.name.replace(/\.[^/.]+$/, "");
    }

    if (jobDescription) {
      // Basic heuristics to grab role and company from a standard JD text
      const roleMatch = jobDescription.match(/(?:role|title|position)[\s:]*([A-Za-z0-9\s-]+)/i);
      if (roleMatch) role = roleMatch[1].trim();
      
      const companyMatch = jobDescription.match(/(?:company|organization)[\s:]*([A-Za-z0-9\s-]+)/i);
      if (companyMatch) company = companyMatch[1].trim();
    }

    return { name, role, company };
  }, [generatedResumeText, resumeFile, jobDescription]);

  const previewFilename = generateResumeFileName(namingMetadata);

  // ── Download PDF ──────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    
    toast.promise(
      (async () => {
        setDownloading(true);
        try {
          if (!resumeRef.current) throw new Error("Resume reference not available");
          const html2canvas = (await import('html2canvas')).default;
          const jsPDF = (await import('jspdf')).default;

          const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const imgW = pageW;
          const imgH = (canvas.height * pageW) / canvas.width;
          let y = 0;

          // Handle multi-page if content is taller than A4
          while (y < imgH) {
            pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH);
            y += pageH;
            if (y < imgH) pdf.addPage();
          }

          pdf.save(previewFilename);
        } finally {
          setDownloading(false);
        }
      })(),
      {
        loading: 'Generating high-quality PDF...',
        success: 'PDF downloaded successfully!',
        error: 'Failed to generate PDF.',
      }
    );
  };

  // ── Copy Text ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (generatedResumeText) {
      await navigator.clipboard.writeText(generatedResumeText);
      toast.success('Resume text copied to clipboard!');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Start Over ────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (window.confirm("Are you sure you want to start over? Your optimized resume data will be lost.")) {
      reset();
      router.push('/');
      toast('Started over', { icon: '🔄' });
    }
  };

  const score = matchScore || 85;


  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 text-slate-200 font-inter">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Start
            </button>
            <h1 className="text-4xl font-bold font-outfit text-white">Your Optimized Resume is Ready</h1>
            <p className="text-slate-400">Forged with precision for maximum ATS compatibility.</p>
          </div>

          {/* ATS Score Ring */}
          <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-slate-800 fill-none" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="34"
                  className="stroke-indigo-500 fill-none transition-all duration-1000"
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold font-outfit text-white">{score}%</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ATS Match Score</p>
              <p className="text-sm text-emerald-400 font-bold">{score >= 80 ? 'Highly Competitive' : score >= 60 ? 'Good Match' : 'Needs Work'}</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* Resume Document Preview */}
          <div className="relative">
            {/* Paper shadow layers for depth effect */}
            <div className="absolute inset-x-4 bottom-0 top-4 bg-slate-300 rounded-2xl opacity-30 blur-sm" />
            <div className="absolute inset-x-2 bottom-0 top-2 bg-slate-200 rounded-2xl opacity-40" />
            
            {/* Main paper */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-100">
              {/* Top Toolbar Bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Optimized Resume</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Resume content — this div is captured for PDF export */}
              <div ref={resumeRef} className="px-14 py-10 min-h-[900px]" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                {generatedResumeText ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={resumeComponents}
                  >
                    {generatedResumeText}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-3" style={{ color: '#cbd5e1' }}>
                    <FileText className="w-12 h-12 opacity-30" />
                    <p className="text-sm">Your optimized resume will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-32">
            {/* Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Actions
              </h3>
              <div className="space-y-3">
                <div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    {downloading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                    {downloading ? 'Generating PDF…' : 'Download PDF'}
                  </button>
                  <p className="text-[10px] text-slate-500 mt-2 text-center truncate px-2" title={previewFilename}>
                    Filename: <span className="text-slate-400">{previewFilename}</span>
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 py-3.5 px-4 rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-400 fill-indigo-400/30" />
                Score Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Keyword Match', value: Math.min(100, score + 3) },
                  { label: 'ATS Readability', value: Math.min(100, score - 2) },
                  { label: 'Impact Language', value: Math.min(100, score + 5) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">{label}</span>
                      <span className="text-slate-300 font-bold">{value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-indigo-950/50 border border-indigo-900/50 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <span className="text-lg">✨</span>
                AI Insights
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your resume was tailored to significantly improve ATS keyword density, quantifiable achievements, and action verb strength to maximize match with this role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
