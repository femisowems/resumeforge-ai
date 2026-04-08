export interface Resume {
  id: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface GenerationJob {
  id: string;
  resumeId: string;
  jobDescription: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultText?: string;
  matchScore?: number;
  aiModel?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchScore {
  score: number;
  insights: string;
}
