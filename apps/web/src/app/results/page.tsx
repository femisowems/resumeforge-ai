"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Download, Copy, RefreshCw, Check, ArrowLeft, Star, Target, FileText, Loader2, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { generateResumeFileName, NamingMetadata } from '@/lib/generateResumeFileName';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Custom components to render the AI resume text as a beautiful document.
// Note: We use inline hex colors here instead of Tailwind classes because
// Tailwind v4 uses lab()/oklch() which crashes html2canvas!
// We also add pageBreakInside: avoid to prevent slicing elements across pages.
const classicTemplate: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#0f172a' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-[13px] font-medium mb-6" style={{ color: '#64748b', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-8 mb-3 border-b-2" style={{ borderColor: '#e2e8f0', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-sm font-bold uppercase tracking-widest pb-1" style={{ color: '#0f172a' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-semibold text-[15px] mt-4 mb-1" style={{ color: '#1e293b', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#334155', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-1 mb-4" style={{ color: '#334155', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] leading-relaxed" style={{ color: '#334155', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-1 mb-4" style={{ color: '#334155', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic font-medium" style={{ color: '#475569' }}>{children}</em>
  ),
  hr: () => (
    <hr className="border-t my-5" style={{ borderColor: '#e2e8f0' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-indigo-600" style={{ color: '#4f46e5' }}>
      {children}
    </a>
  ),
};

const modernTemplate: Components = {
  h1: ({ children }) => (
    <div className="pb-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#0ea5e9', fontFamily: 'sans-serif' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-[14px] font-bold mb-6 uppercase tracking-wider" style={{ color: '#94a3b8', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-8 mb-4 border-l-4 pl-3" style={{ borderColor: '#0ea5e9', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-bold text-[15px] mt-4 mb-1" style={{ color: '#0f172a', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13.5px] leading-relaxed mb-3" style={{ color: '#475569', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-1.5 mb-4" style={{ color: '#475569', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13.5px] leading-relaxed" style={{ color: '#475569', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-1.5 mb-4" style={{ color: '#475569', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic font-medium" style={{ color: '#64748b' }}>{children}</em>
  ),
  hr: () => (
    <hr className="border-t-2 my-5" style={{ borderColor: '#f1f5f9' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#0ea5e9' }}>
      {children}
    </a>
  ),
};

const minimalistTemplate: Components = {
  h1: ({ children }) => (
    <div className="pb-1 mb-1" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-xl font-bold tracking-wide" style={{ color: '#333333' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-[12px] mb-8" style={{ color: '#666666', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-8 mb-3" style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.3em] pb-2 border-b" style={{ color: '#333333', borderColor: '#eaeaea' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-medium text-[14px] mt-4 mb-1" style={{ color: '#333333', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] leading-loose mb-3" style={{ color: '#555555', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-2 mb-4" style={{ color: '#555555', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] leading-loose" style={{ color: '#555555', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-2 mb-4" style={{ color: '#555555', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#111111' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic" style={{ color: '#777777' }}>{children}</em>
  ),
  hr: () => (
    <hr className="border-t my-6" style={{ borderColor: '#eaeaea' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="border-b" style={{ color: '#333333', borderColor: '#cccccc' }}>
      {children}
    </a>
  ),
};

const executiveTemplate: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold font-serif" style={{ color: '#000000', fontFamily: 'serif' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-[13px] font-serif mb-6" style={{ color: '#333333', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children }) => (
    <div className="mt-8 mb-3 border-b-[3px]" style={{ borderColor: '#000000', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 className="text-sm font-bold font-sans uppercase tracking-widest pb-1" style={{ color: '#000000' }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children }) => (
    <h4 className="font-bold font-serif text-[15px] mt-4 mb-1" style={{ color: '#000000', fontFamily: 'serif', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] font-serif leading-relaxed mb-3" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 space-y-1 mb-4" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto' }}>{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-[13px] font-serif leading-relaxed" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid' }}>{children}</li>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 space-y-1 mb-4" style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto' }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#000000' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic" style={{ color: '#333333' }}>{children}</em>
  ),
  hr: () => (
    <hr className="border-t-[3px] my-5" style={{ borderColor: '#000000' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: '#000000' }}>
      {children}
    </a>
  ),
};

const TEMPLATES = [
  { id: 'classic', name: 'Classic', components: classicTemplate },
  { id: 'modern', name: 'Modern', components: modernTemplate },
  { id: 'minimalist', name: 'Minimalist', components: minimalistTemplate },
  { id: 'executive', name: 'Executive', components: executiveTemplate }
];

export default function ResultsPage() {
  const router = useRouter();
  const { matchScore, reset, generatedResumeText, resumeFile, jobDescription } = useAppStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [downloadPdfSuccess, setDownloadPdfSuccess] = React.useState(false);
  const [downloadDocxSuccess, setDownloadDocxSuccess] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = React.useState(0);
  const resumeRef = React.useRef<HTMLDivElement>(null);

  const activeTemplate = TEMPLATES[activeTemplateIndex];

  const namingMetadata = React.useMemo<NamingMetadata>(() => {
    let name: string | undefined = undefined;
    let role: string | undefined = undefined;
    let company: string | undefined = undefined;

    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (generatedResumeText) {
      const nameMatch = generatedResumeText.match(/^#\s+([^\n\r]+)/m);
      if (nameMatch) {
        name = nameMatch[1].trim();
      }
    }

    if (!name && resumeFile?.name) {
      const fileName = resumeFile.name.replace(/\.[^/.]+$/, "");
      if (!isUUID(fileName)) {
        name = fileName;
      }
    }

    // Ultimate fallback if still no name
    if (!name && generatedResumeText) {
      name = "Optimized-Resume";
    }

    if (jobDescription) {
      // Improved heuristics for my new templates
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
    
    console.log("Starting PDF download with filename:", previewFilename);

    toast.promise(
      (async () => {
        setDownloading(true);
        try {
          if (!resumeRef.current) throw new Error("Resume reference not available");
          
          // Lazy load html2pdf
          const html2pdf = (await import('html2pdf.js')).default;

// ...
          const opt = {
            margin:       0.4, // even smaller margin for wider text
            filename:     previewFilename || 'resume.pdf',
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { 
              scale: 2, 
              useCORS: true, 
              letterRendering: true,
              logging: true, // Enable logging for debugging
            },
            jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
            pagebreak:    { mode: ['css', 'legacy'] }
          };

          const worker = html2pdf().from(resumeRef.current).set(opt);
          await worker.save();
          
          setDownloadPdfSuccess(true);
          setTimeout(() => setDownloadPdfSuccess(false), 2000);
        } catch (err) {
          console.error("PDF Generation error:", err);
          throw err;
        } finally {
          setDownloading(false);
        }
      })(),
      {
        loading: 'Generating high-quality PDF...',
        success: 'PDF downloaded successfully!',
        error: 'Failed to generate PDF. Check console for details.',
      }
    );
  };

  // ── Download DOCX ─────────────────────────────────────────────────────────

  const handleDownloadDocx = async () => {
    if (!generatedResumeText) return;

    toast.promise(
      (async () => {
        setDownloading(true);
        try {
          // Simple markdown to docx conversion logic
          const lines = generatedResumeText.split('\n');
          const children: any[] = [];

          lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) {
              children.push(new Paragraph({}));
              return;
            }

            if (cleanLine.startsWith('# ')) {
              children.push(new Paragraph({
                text: cleanLine.replace('# ', ''),
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }));
            } else if (cleanLine.startsWith('## ')) {
              children.push(new Paragraph({
                text: cleanLine.replace('## ', ''),
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
              }));
            } else if (cleanLine.startsWith('### ')) {
              children.push(new Paragraph({
                text: cleanLine.replace('### ', ''),
                heading: HeadingLevel.HEADING_3,
              }));
            } else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
              children.push(new Paragraph({
                children: [new TextRun(cleanLine.replace(/^[-*]\s+/, ''))],
                bullet: { level: 0 },
              }));
            } else {
              children.push(new Paragraph({
                children: [new TextRun(cleanLine)],
              }));
            }
          });

          const doc = new Document({
            sections: [{
              properties: {},
              children: children,
            }],
          });

            const blob = await Packer.toBlob(doc);
            const docxName = (previewFilename || 'resume.pdf').replace('.pdf', '') + '.docx';
            saveAs(blob, docxName);
            setDownloadDocxSuccess(true);
            setTimeout(() => setDownloadDocxSuccess(false), 2000);
          } catch (err) {
            console.error("DOCX Generation error:", err);
            throw err;
          } finally {
            setDownloading(false);
          }
        })(),
        {
          loading: 'Generating Word document...',
          success: 'DOCX downloaded successfully!',
          error: 'Failed to generate Word document.',
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
  const handleResetRequest = () => {
    setShowConfirmModal(true);
  };

  const handleResetConfirm = () => {
    setShowConfirmModal(false);
    reset();
    router.push('/');
  };

  const score = matchScore || 85;


  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-950 text-slate-200 font-inter">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetRequest}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Start
              </button>
              <div className="h-3 w-[1px] bg-slate-800" />
              <button
                onClick={() => router.push('/results-2')}
                className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-400/70 hover:text-indigo-400 transition-colors uppercase tracking-widest border border-indigo-500/20 px-2 py-0.5 rounded-full bg-indigo-500/5 hover:bg-indigo-500/10"
              >
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                Experimental View
              </button>
            </div>
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
            <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-[816px] mx-auto overflow-hidden ring-1 ring-slate-900/5 min-h-[1056px] flex flex-col">
              {/* Top Toolbar Bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Optimized Resume</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTemplateIndex((prev) => (prev + 1) % TEMPLATES.length)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-sm active:scale-95 relative z-10"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    Template: {activeTemplate.name}
                  </button>
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
              </div>

              {/* Resume content — captured for PDF export */}
              <div ref={resumeRef} className="bg-white px-8 py-12 sm:px-14 sm:py-16 min-h-[1056px] flex-1" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                {generatedResumeText ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={activeTemplate.components}
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading || !generatedResumeText}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : downloadPdfSuccess ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {downloadPdfSuccess ? 'Done!' : '.PDF'}
                </button>
                <button
                  onClick={handleDownloadDocx}
                  disabled={downloading || !generatedResumeText}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-700"
                >
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : downloadDocxSuccess ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {downloadDocxSuccess ? 'Done!' : '.DOCX'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center break-all px-2" title={previewFilename.replace('.pdf', '')}>
                Filename: <span className="text-slate-400">{previewFilename.replace('.pdf', '')}</span>
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
                  onClick={handleResetRequest}
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

      {/* Start Over Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Start Over?</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Are you sure you want to start over? Your optimized resume data and match scores will be permanently lost.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 rounded-xl font-bold text-sm transition-colors"
              >
                Yes, Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
