import { create } from 'zustand';
import axios from 'axios';
import { api } from '../lib/api';

interface AppState {
  resumeFile: File | null;
  pastedResumeText: string;
  jobDescription: string;
  isGenerating: boolean;
  generationStep: 'idle' | 'parsing' | 'analyzing' | 'optimizing' | 'generating' | 'completed' | 'failed';
  matchScore: number | null;
  generatedResumeText: string | null;
  generatedResumeId: string | null;
  aiModel: string | null;
  error: string | null;
  
  setResumeFile: (file: File | null) => void;
  setPastedResumeText: (text: string) => void;
  setJobDescription: (jd: string) => void;
  startGeneration: () => Promise<void>;
  pollJobStatus: (jobId: string) => Promise<void>;
  setGeneratedResumeText: (text: string) => void;
  setGenerationStep: (step: AppState['generationStep']) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  resumeFile: null,
  pastedResumeText: '',
  jobDescription: '',
  isGenerating: false,
  generationStep: 'idle',
  matchScore: null,
  generatedResumeText: null,
  generatedResumeId: null,
  aiModel: null,
  error: null,

  setResumeFile: (file) => set({ resumeFile: file }),
  setPastedResumeText: (text) => set({ pastedResumeText: text }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  setGeneratedResumeText: (text) => set({ generatedResumeText: text }),
  startGeneration: async () => {
    const { resumeFile, pastedResumeText, jobDescription } = get();
    if (!resumeFile && !pastedResumeText.trim()) return;

    set({ isGenerating: true, generationStep: 'parsing', error: null });

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else {
        formData.append('resumeText', pastedResumeText);
      }
      formData.append('jobDescription', jobDescription);

      // Using the centralized backend API URL
      const response = await axios.post(api('resumes/upload'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      if (data.jobId) {
        set({ generatedResumeId: data.jobId, generationStep: 'analyzing' });
      } else {
        throw new Error('No jobId returned from backend');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      set({ 
        isGenerating: false, 
        generationStep: 'failed',
      });
    }
  },
  
  pollJobStatus: async (jobId: string) => {
    try {
      const response = await axios.get(api(`documents/${jobId}`));
      
      const doc = response.data;
      console.log(`Polling status for ${jobId}:`, doc?.status);
      
      if (doc && doc.status === 'completed') {
        set({ 
          generationStep: 'completed',
          matchScore: doc.matchScore || 85,
          generatedResumeText: doc.resultText,
          aiModel: doc.aiModel,
        });
      } else if (doc && doc.status === 'failed') {
        console.warn('Job failed on server:', jobId, doc.error);
        set({ 
          generationStep: 'failed',
          isGenerating: false,
          error: doc.error || 'Unknown error occurred'
        });
      }
    } catch (error: any) {
      console.error('Polling failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return;
      }
      set({ generationStep: 'failed' });
    }
  },

  setGenerationStep: (step) => set({ generationStep: step }),
  reset: () => set({ 
    resumeFile: null, 
    pastedResumeText: '',
    jobDescription: '', 
    isGenerating: false, 
    generationStep: 'idle',
    matchScore: null,
    generatedResumeText: null,
    generatedResumeId: null,
    aiModel: null
  }),
}));
