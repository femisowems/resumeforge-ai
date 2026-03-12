"use client";

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Download, Copy, RefreshCw, Check, ArrowLeft, Star, Target, FileText, Loader2, Palette, Edit3, Eye, Split } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { generateResumeFileName, NamingMetadata } from '@/lib/generateResumeFileName';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import ResumeEditor from '@/components/editor/ResumeEditor';
import rehypeRaw from 'rehype-raw';

// Custom components to render the AI resume text as a beautiful document.
const classicTemplate: Components = {
  h1: ({ children }) => (
    <div className="text-center pb-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#0f172a' }}>{children}</h1>
    </div>
  ),
  h2: ({ children }) => (
    <p className="text-center text-[13px] font-medium mb-6" style={{ color: '#64748b', pageBreakInside: 'avoid' }}>{children}</p>
  ),
  h3: ({ children, className, ...props }) => (
    <div className="mt-8 mb-3 border-b-2" style={{ borderColor: '#e2e8f0', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 {...props} className={`text-sm font-bold uppercase tracking-widest pb-1 ${className || ''}`} style={{ color: '#0f172a', ...props.style }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 {...props} className={`font-semibold text-[15px] mt-4 mb-1 ${className || ''}`} style={{ color: '#1e293b', pageBreakInside: 'avoid', pageBreakAfter: 'avoid', ...props.style }}>{children}</h4>
  ),
  p: ({ children, className, ...props }) => (
    <p {...props} className={`text-[13px] leading-relaxed mb-3 ${className || ''}`} style={{ color: '#334155', pageBreakInside: 'avoid', ...props.style }}>{children}</p>
  ),
  ul: ({ children, className, ...props }) => (
    <ul {...props} className={`list-disc list-outside ml-4 space-y-1 mb-4 ${className || ''}`} style={{ color: '#334155', pageBreakInside: 'auto', ...props.style }}>{children}</ul>
  ),
  li: ({ children, className, ...props }) => (
    <li {...props} className={`text-[13px] leading-relaxed ${className || ''}`} style={{ color: '#334155', pageBreakInside: 'avoid', ...props.style }}>{children}</li>
  ),
  ol: ({ children, className, ...props }) => (
    <ol {...props} className={`list-decimal list-outside ml-4 space-y-1 mb-4 ${className || ''}`} style={{ color: '#334155', pageBreakInside: 'auto', ...props.style }}>{children}</ol>
  ),
  strong: ({ children, style, className, ...props }) => (
    <strong {...props} className={`font-semibold ${className || ''}`} style={{ color: '#0f172a', ...style }}>{children}</strong>
  ),
  em: ({ children, style, className, ...props }) => (
    <em {...props} className={`not-italic font-medium ${className || ''}`} style={{ color: '#475569', ...style }}>{children}</em>
  ),
  blockquote: ({ children, style, className, ...props }) => (
    <blockquote {...props} className={`border-l-4 pl-4 py-1 my-4 italic text-slate-600 bg-slate-50 rounded-r-md ${className || ''}`} style={{ borderColor: '#4f46e5', ...style }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="border-t my-5" style={{ borderColor: '#e2e8f0' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-indigo-600" style={{ color: '#4f46e5' }}>
      {children}
    </a>
  ),
  mark: ({ children }) => (
    <mark className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold text-[11px] mx-0.5" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
      {children}
    </mark>
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
  h3: ({ children, className, ...props }) => (
    <div className="mt-8 mb-4 border-l-4 pl-3" style={{ borderColor: '#0ea5e9', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 {...props} className={`text-lg font-bold ${className || ''}`} style={{ color: '#0f172a', ...props.style }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 {...props} className={`font-bold text-[15px] mt-4 mb-1 ${className || ''}`} style={{ color: '#0f172a', pageBreakInside: 'avoid', pageBreakAfter: 'avoid', ...props.style }}>{children}</h4>
  ),
  p: ({ children, className, ...props }) => (
    <p {...props} className={`text-[13.5px] leading-relaxed mb-3 ${className || ''}`} style={{ color: '#475569', pageBreakInside: 'avoid', ...props.style }}>{children}</p>
  ),
  ul: ({ children, className, ...props }) => (
    <ul {...props} className={`list-disc list-outside ml-4 space-y-1.5 mb-4 ${className || ''}`} style={{ color: '#475569', pageBreakInside: 'auto', ...props.style }}>{children}</ul>
  ),
  li: ({ children, className, ...props }) => (
    <li {...props} className={`text-[13.5px] leading-relaxed ${className || ''}`} style={{ color: '#475569', pageBreakInside: 'avoid', ...props.style }}>{children}</li>
  ),
  ol: ({ children, className, ...props }) => (
    <ol {...props} className={`list-decimal list-outside ml-4 space-y-1.5 mb-4 ${className || ''}`} style={{ color: '#475569', pageBreakInside: 'auto', ...props.style }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#0f172a' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic font-medium" style={{ color: '#64748b' }}>{children}</em>
  ),
  blockquote: ({ children, style, className, ...props }) => (
    <blockquote {...props} className={`border-l-4 pl-4 py-2 my-5 bg-sky-50/50 rounded-r-lg ${className || ''}`} style={{ borderColor: '#0ea5e9', ...style }}>
      <div className="text-sky-900 italic">{children}</div>
    </blockquote>
  ),
  hr: () => (
    <hr className="border-t-2 my-5" style={{ borderColor: '#f1f5f9' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#0ea5e9' }}>
      {children}
    </a>
  ),
  mark: ({ children }) => (
    <mark className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold text-[11px] mx-0.5" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
      {children}
    </mark>
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
  h3: ({ children, className, ...props }) => (
    <div className="mt-8 mb-3" style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 {...props} className={`text-xs font-semibold uppercase tracking-[0.3em] pb-2 border-b ${className || ''}`} style={{ color: '#333333', borderColor: '#eaeaea', ...props.style }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 {...props} className={`font-medium text-[14px] mt-4 mb-1 ${className || ''}`} style={{ color: '#333333', pageBreakInside: 'avoid', pageBreakAfter: 'avoid', ...props.style }}>{children}</h4>
  ),
  p: ({ children, className, ...props }) => (
    <p {...props} className={`text-[13px] leading-loose mb-3 ${className || ''}`} style={{ color: '#555555', pageBreakInside: 'avoid', ...props.style }}>{children}</p>
  ),
  ul: ({ children, className, ...props }) => (
    <ul {...props} className={`list-disc list-outside ml-4 space-y-2 mb-4 ${className || ''}`} style={{ color: '#555555', pageBreakInside: 'auto', ...props.style }}>{children}</ul>
  ),
  li: ({ children, className, ...props }) => (
    <li {...props} className={`text-[13px] leading-loose ${className || ''}`} style={{ color: '#555555', pageBreakInside: 'avoid', ...props.style }}>{children}</li>
  ),
  ol: ({ children, className, ...props }) => (
    <ol {...props} className={`list-decimal list-outside ml-4 space-y-2 mb-4 ${className || ''}`} style={{ color: '#555555', pageBreakInside: 'auto', ...props.style }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: '#111111' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="not-italic" style={{ color: '#777777' }}>{children}</em>
  ),
  blockquote: ({ children, style, className, ...props }) => (
    <blockquote {...props} className={`pl-6 my-6 border-l border-slate-300 text-slate-500 italic ${className || ''}`} style={{ ...style }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="border-t my-6" style={{ borderColor: '#eaeaea' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="border-b" style={{ color: '#333333', borderColor: '#cccccc' }}>
      {children}
    </a>
  ),
  mark: ({ children }) => (
    <mark className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold text-[11px] mx-0.5 border border-slate-200" style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}>
      {children}
    </mark>
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
  h3: ({ children, className, ...props }) => (
    <div className="mt-8 mb-3 border-b-[3px]" style={{ borderColor: '#000000', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
      <h3 {...props} className={`text-sm font-bold font-sans uppercase tracking-widest pb-1 ${className || ''}`} style={{ color: '#000000', ...props.style }}>
        {children}
      </h3>
    </div>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 {...props} className={`font-bold font-serif text-[15px] mt-4 mb-1 ${className || ''}`} style={{ color: '#000000', fontFamily: 'serif', pageBreakInside: 'avoid', pageBreakAfter: 'avoid', ...props.style }}>{children}</h4>
  ),
  p: ({ children, className, ...props }) => (
    <p {...props} className={`text-[13px] font-serif leading-relaxed mb-3 ${className || ''}`} style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid', ...props.style }}>{children}</p>
  ),
  ul: ({ children, className, ...props }) => (
    <ul {...props} className={`list-disc list-outside ml-4 space-y-1 mb-4 ${className || ''}`} style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto', ...props.style }}>{children}</ul>
  ),
  li: ({ children, className, ...props }) => (
    <li {...props} className={`text-[13px] font-serif leading-relaxed ${className || ''}`} style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'avoid', ...props.style }}>{children}</li>
  ),
  ol: ({ children, className, ...props }) => (
    <ol {...props} className={`list-decimal list-outside ml-4 space-y-1 mb-4 ${className || ''}`} style={{ color: '#111111', fontFamily: 'serif', pageBreakInside: 'auto', ...props.style }}>{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-bold" style={{ color: '#000000' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic" style={{ color: '#333333' }}>{children}</em>
  ),
  blockquote: ({ children, style, className, ...props }) => (
    <blockquote {...props} className={`border-l-[3px] border-black pl-4 my-6 font-serif italic text-black bg-slate-50 p-2 ${className || ''}`} style={{ ...style }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="border-t-[3px] my-5" style={{ borderColor: '#000000' }} />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: '#000000' }}>
      {children}
    </a>
  ),
  mark: ({ children }) => (
    <mark className="bg-black text-white px-2 py-0.5 rounded-sm font-bold text-[11px] mx-0.5 uppercase tracking-tighter" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {children}
    </mark>
  ),
};

const TEMPLATES = [
  { id: 'classic', name: 'Classic', components: classicTemplate },
  { id: 'modern', name: 'Modern', components: modernTemplate },
  { id: 'minimalist', name: 'Minimalist', components: minimalistTemplate },
  { id: 'executive', name: 'Executive', components: executiveTemplate }
];

export default function ResultsPageExperimental() {
  const router = useRouter();
  const { matchScore, reset, generatedResumeText, resumeFile, jobDescription } = useAppStore();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [downloadPdfSuccess, setDownloadPdfSuccess] = React.useState(false);
  const [downloadDocxSuccess, setDownloadDocxSuccess] = React.useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<'split' | 'edit' | 'preview'>('split');
  const [localText, setLocalText] = React.useState(generatedResumeText || '');
  const [editorMode, setEditorMode] = React.useState<'visual' | 'markdown'>('visual');
  
  const resumeRef = React.useRef<HTMLDivElement>(null);
  const activeTemplate = TEMPLATES[activeTemplateIndex];

  React.useEffect(() => {
    if (generatedResumeText) {
      setLocalText(generatedResumeText);
    }
  }, [generatedResumeText]);

  const namingMetadata = React.useMemo<NamingMetadata>(() => {
    let name: string | undefined = undefined;
    if (localText) {
      const nameMatch = localText.match(/^#\s+([^\n\r]+)/m);
      if (nameMatch) name = nameMatch[1].trim();
    }
    return { name };
  }, [localText]);

  const previewFilename = generateResumeFileName(namingMetadata);

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    toast.promise(
      (async () => {
        setDownloading(true);
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          const opt = {
            margin: 0.4,
            filename: previewFilename || 'resume.pdf',
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const },
            pagebreak: { mode: ['css', 'legacy'] }
          };
          if (!resumeRef.current) throw new Error("Resume reference not available");
          await html2pdf().from(resumeRef.current).set(opt).save();
          setDownloadPdfSuccess(true);
          setTimeout(() => setDownloadPdfSuccess(false), 2000);
        } finally {
          setDownloading(false);
        }
      })(),
      {
        loading: 'Generating PDF...',
        success: 'PDF downloaded!',
        error: 'Export failed',
      }
    );
  };

  const handleDownloadDocx = async () => {
    if (!localText) return;
    setDownloading(true);
    try {
      const children: any[] = [];
      localText.split('\n').forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) { children.push(new Paragraph({})); return; }
        if (cleanLine.startsWith('# ')) {
          children.push(new Paragraph({ text: cleanLine.replace('# ', ''), heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));
        } else if (cleanLine.startsWith('## ')) {
          children.push(new Paragraph({ text: cleanLine.replace('## ', ''), heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }));
        } else if (cleanLine.startsWith('### ')) {
          children.push(new Paragraph({ text: cleanLine.replace('### ', ''), heading: HeadingLevel.HEADING_3 }));
        } else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
          children.push(new Paragraph({ children: [new TextRun(cleanLine.replace(/^[-*]\s+/, ''))], bullet: { level: 0 } }));
        } else {
          children.push(new Paragraph({ children: [new TextRun(cleanLine)] }));
        }
      });
      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, previewFilename.replace('.pdf', '.docx'));
      setDownloadDocxSuccess(true);
      setTimeout(() => setDownloadDocxSuccess(false), 2000);
    } finally {
      setDownloading(false);
    }
  };

  const score = matchScore || 85;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden pt-16">
      {/* Top Toolbar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/results')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Markdown
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Split className="w-3.5 h-3.5" />
              Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTemplateIndex((prev) => (prev + 1) % TEMPLATES.length)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
          >
            <Palette className="w-4 h-4 text-indigo-400" />
            Template: {activeTemplate.name}
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
            <Star className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
            <span className="text-xs font-bold text-white tracking-widest">{score}% Match</span>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white h-10 px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-slate-800 bg-slate-900/50`}>
            <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Editor Mode</span>
                <div className="flex bg-slate-950 rounded-md p-1 border border-slate-800">
                  <button 
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${editorMode === 'visual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Visual
                  </button>
                  <button 
                    onClick={() => setEditorMode('markdown')}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${editorMode === 'markdown' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Markdown
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(localText);
                  toast.success('Copied to clipboard');
                }}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 transition-colors"
                title="Copy markdown content"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            {editorMode === 'visual' ? (
              <ResumeEditor 
                content={localText} 
                onChange={setLocalText} 
              />
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/20">
                <textarea
                  value={localText}
                  onChange={(e) => setLocalText(e.target.value)}
                  onKeyDown={(e) => {
                    // Handle Ctrl+S or Cmd+S
                    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                      e.preventDefault();
                      setLocalText(localText); 
                      toast.success('Progress saved', { icon: '💾', style: { background: '#1e293b', color: '#fff', fontSize: '12px' } });
                    }

                    // Handle Tab key for indentation
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.currentTarget.selectionStart;
                      const end = e.currentTarget.selectionEnd;
                      const value = e.currentTarget.value;
                      
                      const newValue = value.substring(0, start) + "\t" + value.substring(end);
                      setLocalText(newValue);
                      
                      // Reset cursor position after state update
                      setTimeout(() => {
                        const target = document.querySelector('textarea') as HTMLTextAreaElement;
                        if (target) {
                          target.selectionStart = target.selectionEnd = start + 1;
                        }
                      }, 0);
                    }
                  }}
                  className="flex-1 p-8 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none custom-scrollbar whitespace-pre-wrap leading-relaxed"
                  placeholder="Paste or write your resume markdown here..."
                  spellCheck={false}
                />
                <div className="px-6 py-2 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center shrink-0">
                  <span className="text-[9px] text-slate-500 font-medium">Tips: You can use # for headers and - for bullets</span>
                  <span className="text-[9px] text-slate-500 font-mono">{localText.length} characters</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Side */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex-1 bg-slate-200 overflow-auto p-12 custom-scrollbar flex justify-center`}>
            <div 
              ref={resumeRef}
              className="w-[816px] min-h-[1056px] h-fit bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 px-14 py-16 text-left shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={activeTemplate.components}
              >
                {localText}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
