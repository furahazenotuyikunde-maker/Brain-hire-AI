import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
// Using require for pdf-parse specifically to handle its unusual exports in TS
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up Multer with a 10MB limit per file
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Mock database (Temporary in-memory)
interface Job {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Candidate {
  id: string;
  candidateName: string;
  score: number;
  reasoning: string;
  matchedKeywords: string[];
  email: string;
  status: string;
  jobId: string;
}

let db_jobs: Job[] = [
    { id: '1', title: 'Senior Frontend Engineer', description: 'React, Vite, CSS expert', created_at: new Date().toISOString() }
];
let db_candidates: Candidate[] = [];

// Helper: Calculate relevance score
const calculateScore = (jd: string, cvText: string) => {
    const jdKeywords = (jd.toLowerCase().match(/\b(\w+)\b/g) || []) as string[];
    const cvKeywords = (cvText.toLowerCase().match(/\b(\w+)\b/g) || []) as string[];
    
    const uniqueJdKeywords = new Set(jdKeywords.filter((k: string) => k.length > 3));
    const matchedKeywords = Array.from(uniqueJdKeywords).filter((k: string) => cvKeywords.includes(k));
    
    const score = uniqueJdKeywords.size > 0 ? Math.round((matchedKeywords.length / uniqueJdKeywords.size) * 100) : 0;
    
    return { 
        score, 
        matchedKeywords: matchedKeywords.slice(0, 10), // Limit to top 10
        reasoning: matchedKeywords.length > 2 
            ? `Demonstrates proficiency in ${matchedKeywords.slice(0, 3).join(', ')} and other core requirements.` 
            : 'Minimal technical overlap found with the current job description.'
    };
};

// --- ROUTES ---

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok', message: 'BrainHireAI Backend is live.' });
});

app.get('/api/stats', (_: Request, res: Response) => {
  res.json({
    totalApplicants: db_candidates.length,
    activeJobs: db_jobs.length,
    scansRun: db_candidates.length,
    topCandidates: db_candidates.filter(c => c.score > 75).length
  });
});

app.get('/api/jobs', (_: Request, res: Response) => {
  res.json(db_jobs);
});

app.post('/api/analyze', upload.array('resumes'), async (req: Request, res: Response) => {
  console.log('--- ANALYSIS REQUEST START ---');
  try {
    const { jobDescription, jobTitle } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      console.warn('No files received in request.');
      return res.status(400).json({ error: 'No PDF or Text files uploaded.' });
    }

    const currentJobId = Math.random().toString(36).substring(7);
    db_jobs.unshift({
        id: currentJobId,
        title: jobTitle || 'New Role',
        description: jobDescription || 'No description provided.',
        created_at: new Date().toISOString()
    });

    const analysisResults: Candidate[] = [];

    for (const file of files) {
      console.log(`Processing candidate file: ${file.originalname}`);
      let text = '';
      
      try {
        if (file.mimetype === 'application/pdf') {
          // pdf-parse can be sensitive to buffer types on some node versions
          const data = await pdf(file.buffer);
          text = data.text;
          console.log(`Parsed PDF text length: ${text.length}`);
        } else {
          text = file.buffer.toString('utf-8');
          console.log(`Read text file content length: ${text.length}`);
        }
      } catch (err) {
        console.error(`ERROR parsing ${file.originalname}:`, err);
        text = ''; // Fallback to empty text
      }

      const { score, reasoning, matchedKeywords } = calculateScore(jobDescription || '', text);
      
      const candidate: Candidate = {
        id: Math.random().toString(36).substring(7),
        candidateName: file.originalname.replace('.pdf', '').replace('.txt', ''),
        score,
        reasoning,
        matchedKeywords,
        email: 'recruiting@brainhire.ai',
        status: 'Pending',
        jobId: currentJobId
      };

      db_candidates.push(candidate);
      analysisResults.push(candidate);
    }

    res.json({
      jobTitle: jobTitle || 'New Role',
      totalAnalyzed: analysisResults.length,
      candidates: analysisResults.sort((a, b) => b.score - a.score)
    });

  } catch (err) {
    console.error('CRITICAL BACKEND ERROR:', err);
    res.status(500).json({ error: 'Failed to analyze candidates due to internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`>>> BrainHireAI Engine running at http://localhost:${port}`);
});
