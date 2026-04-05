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

// Helper: Calculate relevance score (simple version)
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

// POST upload and analyze (User)
router.post('/upload', auth, upload.single('cv'), async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No CV uploaded' });
    }

    if (!jobId) {
      return res.status(400).json({ error: 'No Job ID provided' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    // Parsing text from PDF
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
        console.error('Text extraction error:', err);
    }

    const { score, reasoning, matchedKeywords } = calculateScore(job.description, text);

    const newCV = new CV({
        userId: req.user?.id,
        fileName: file.originalname,
        fileUrl: file.path, 
        candidateName: file.originalname,
        matchedJobId: jobId,
        score,
        status: 'analyzed',
        analysis: {
            reasoning,
            matchedKeywords
        }
    });

    await newCV.save();
    res.status(201).json(newCV);

  } catch (err) {
    console.error('CV upload error:', err);
    res.status(500).json({ error: 'Failed to upload/analyze CV' });
  }
});

// GET user CVs (User)
router.get('/my-cvs', auth, async (req: AuthRequest, res: Response) => {
    try {
        const cvs = await CV.find({ userId: req.user?.id }).populate('matchedJobId', 'title').sort({ createdAt: -1 });
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your CVs' });
    }
});

// GET all CVs (Admin)
router.get('/', [auth], async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const cvs = await CV.find().populate('userId', 'name email').populate('matchedJobId', 'title').sort({ createdAt: -1 });
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch CVs' });
    }
});

export default router;
