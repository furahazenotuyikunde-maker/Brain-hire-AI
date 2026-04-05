import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CV } from '../models/CV';
import { Job } from '../models/Job';
import { auth, AuthRequest } from '../middleware/auth';
const pdf = require('pdf-parse');

const router = express.Router();

// CV upload directory setup
const uploadDir = 'uploads/cvs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Helper: Calculate relevance score (Advanced version for table UI)
const calculateScore = (jd: string, cvText: string) => {
    const jdKeywords = (jd.toLowerCase().match(/\b(\w+)\b/g) || []) as string[];
    const cvKeywords = (cvText.toLowerCase().match(/\b(\w+)\b/g) || []) as string[];
    
    const uniqueJdKeywords = new Set(jdKeywords.filter((k: string) => k.length > 3));
    const matchedKeywords = Array.from(uniqueJdKeywords).filter((k: string) => cvKeywords.includes(k));
    
    const score = uniqueJdKeywords.size > 0 ? Math.round((matchedKeywords.length / uniqueJdKeywords.size) * 100) : 0;
    
    // Suggesting strengths based on top matches
    const strengths = matchedKeywords.length > 0 
        ? `Expertise in ${matchedKeywords.slice(0, 3).join(', ')}. Strong technical alignment.`
        : 'General professional experience.';
        
    // Suggesting gaps based on missing JD keywords
    const missing = Array.from(uniqueJdKeywords).filter(k => !matchedKeywords.includes(k));
    const gaps = missing.length > 0
        ? `Lower exposure to ${missing.slice(0, 2).join(', ')}.`
        : 'Minimal requirement gaps detected.';

    return { 
        score, 
        matchedKeywords: matchedKeywords.slice(0, 10),
        reasoning: matchedKeywords.length > 2 
            ? `Demonstrates proficiency in ${matchedKeywords.slice(0, 3).join(', ')}.` 
            : 'Candidate does not strictly meet all core technical requirements.',
        strengths,
        gaps
    };
};

// POST upload and analyze
router.post('/upload', auth, upload.single('cv'), async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No CV uploaded' });
    if (!jobId) return res.status(400).json({ error: 'No Job ID provided' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    let text = '';
    try {
        if (file.mimetype === 'application/pdf') {
          const dataBuffer = fs.readFileSync(file.path);
          const data = await pdf(dataBuffer);
          text = data.text;
        } else {
          text = fs.readFileSync(file.path, 'utf-8');
        }
    } catch (err) {
        text = '';
    }

    const { score, reasoning, matchedKeywords, strengths, gaps } = calculateScore(job.description, text);

    const newCV = new CV({
        userId: req.user?.id,
        fileName: file.originalname,
        fileUrl: file.path, 
        candidateName: file.originalname.split('-').pop()?.replace('.pdf','').replace('.txt',''),
        matchedJobId: jobId,
        score,
        status: 'analyzed',
        analysis: { reasoning, matchedKeywords, strengths, gaps }
    });

    await newCV.save();
    res.status(201).json(newCV);

  } catch (err) {
    res.status(500).json({ error: 'Failed to upload/analyze CV' });
  }
});

// GET user CVs
router.get('/my-cvs', auth, async (req: AuthRequest, res: Response) => {
    try {
        const cvs = await CV.find({ userId: req.user?.id }).populate('matchedJobId', 'title').sort({ createdAt: -1 });
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your CVs' });
    }
});

// GET all CVs
router.get('/', [auth], async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
        const cvs = await CV.find().populate('userId', 'name email').populate('matchedJobId', 'title').sort({ createdAt: -1 });
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch CVs' });
    }
});

export default router;
