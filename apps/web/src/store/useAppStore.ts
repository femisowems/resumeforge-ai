import { create } from 'zustand';

interface AppState {
  resumeFile: File | null;
  jobDescription: string;
  isGenerating: boolean;
  generationStep: 'idle' | 'parsing' | 'analyzing' | 'optimizing' | 'generating' | 'completed';
  matchScore: number | null;
  generatedResumeId: string | null;
  
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  startGeneration: () => void;
  setGenerationStep: (step: AppState['generationStep']) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  resumeFile: null,
  jobDescription: '',
  isGenerating: false,
  generationStep: 'idle',
  matchScore: null,
  generatedResumeId: null,

  setResumeFile: (file) => set({ resumeFile: file }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  startGeneration: () => set({ isGenerating: true, generationStep: 'parsing' }),
  setGenerationStep: (step) => set({ generationStep: step }),
  reset: () => set({ 
    resumeFile: null, 
    jobDescription: '', 
    isGenerating: false, 
    generationStep: 'idle',
    matchScore: null,
    generatedResumeId: null
  }),
}));
