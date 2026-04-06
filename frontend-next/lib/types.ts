export interface JobSummary {
  _id: string;
  title: string;
  description: string;
  applicants: number;
  createdAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  totalAnalyzed: number;
  topMatches: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  jobSummaries: JobSummary[];
}

export interface CVAnalysis {
  _id: string;
  candidateName?: string;
  score?: number;
  status?: string;
  analysis?: {
    reasoning?: string;
    matchedKeywords?: string[];
    strengths?: string;
    gaps?: string;
  };
}

export interface JobDetail {
  _id: string;
  title: string;
  description: string;
  skills?: string[];
  qualifications?: string[];
  createdAt: string;
}

export interface AnalysisResult {
  jobTitle: string;
  totalAnalyzed: number;
  candidates: {
    candidateName: string;
    score: number;
    reasoning: string;
    matchedKeywords: string[];
    email: string;
    status: string;
  }[];
}
