import { create } from 'zustand';
import axios from 'axios';

interface AppState {
  resumeFile: File | null;
  jobDescription: string;
  isGenerating: boolean;
  generationStep: 'idle' | 'parsing' | 'analyzing' | 'optimizing' | 'generating' | 'completed';
  matchScore: number | null;
  generatedResumeText: string | null;
  generatedResumeId: string | null;
  
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  startGeneration: () => Promise<void>;
  pollJobStatus: (jobId: string) => Promise<void>;
  setGenerationStep: (step: AppState['generationStep']) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  resumeFile: null,
  jobDescription: '',
  isGenerating: false,
  generationStep: 'idle',
  matchScore: null,
  generatedResumeText: null,
  generatedResumeId: null,

  setResumeFile: (file) => set({ resumeFile: file }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  startGeneration: async () => {
    const { resumeFile, jobDescription } = get();
    if (!resumeFile) return;

    set({ isGenerating: true, generationStep: 'parsing' });

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      // Using the backend API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await axios.post(`${API_URL}/resumes/upload`, formData, {
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
        generationStep: 'failed' as AppState['generationStep'],
      });
    }
  },
  
  pollJobStatus: async (jobId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${API_URL}/documents/${jobId}`);
      
      const doc = response.data;
      if (doc && doc.status === 'completed') {
        set({ 
          generationStep: 'completed',
          matchScore: doc.matchScore || 85,
          generatedResumeText: doc.resultText,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return;
      console.error('Polling failed:', error);
    }
  },

  setGenerationStep: (step) => set({ generationStep: step }),
  reset: () => set({ 
    resumeFile: null, 
    jobDescription: '', 
    isGenerating: false, 
    generationStep: 'idle',
    matchScore: null,
    generatedResumeText: null,
    generatedResumeId: null
  }),
}));
