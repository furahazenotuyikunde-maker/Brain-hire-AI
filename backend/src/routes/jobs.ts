import express, { Response } from 'express';
import { Job } from '../models/Job';
import { CV } from '../models/CV';
import { auth, adminOnly, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET all jobs (public)
router.get('/', async (_: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET single job by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST new job (any authenticated user for analysis)
router.post('/', [auth], async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, skills, qualifications } = req.body;
    const job = new Job({ title, description, skills, qualifications, createdBy: req.user?.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Dashboard summary for recruiter or admin
router.get('/dashboard/summary', [auth], async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const jobFilter = isAdmin ? {} : { createdBy: userId };

    const jobs = await Job.find(jobFilter).sort({ createdAt: -1 });
    const cvs = await CV.find(isAdmin ? {} : { userId }).populate('matchedJobId', 'title');

    const stats = {
      totalJobs: jobs.length,
      totalCandidates: cvs.length,
      totalAnalyzed: cvs.filter((cv) => cv.status === 'analyzed').length,
      topMatches: cvs.filter((cv) => (cv.score || 0) >= 75).length,
    };

    const jobSummaries = jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      applicants: cvs.filter((cv) => String(cv.matchedJobId?._id || cv.matchedJobId) === String(job._id)).length,
      createdAt: job.createdAt,
    }));

    res.json({ stats, jobSummaries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// PUT update job (admin)
router.put('/:id', [auth, adminOnly], async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE job (admin)
router.delete('/:id', [auth, adminOnly], async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete job' });
  }
});

export default router;
