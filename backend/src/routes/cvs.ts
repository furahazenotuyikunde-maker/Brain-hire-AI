import express, { Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { CV } from '../models/CV';
import { Job } from '../models/Job';
import { auth, AuthRequest } from '../middleware/auth';
import { generateAIAnalysis } from '../services/ai';
const pdf = require('pdf-parse');

const router = express.Router();

// CV upload directory setup
const uploadDir = 'uploads/cvs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

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

    const analysis = await generateAIAnalysis(job.description, text);

    const newCV = new CV({
        userId: req.user?.id,
        fileName: file.originalname,
        fileUrl: file.path,
        candidateName: file.originalname.replace(/\.(pdf|txt)$/i, '').replace(/^[0-9]+-/, ''),
        matchedJobId: jobId,
        score: analysis.score,
        status: 'analyzed',
        analysis,
    });

    await newCV.save();
    res.status(201).json(newCV);

  } catch (err) {
    res.status(500).json({ error: 'Failed to upload/analyze CV' });
  }
});

// GET CVs for a specific job
router.get('/job/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        const cvs = await CV.find({ matchedJobId: req.params.id }).sort({ score: -1 });
        res.json(cvs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job results' });
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
