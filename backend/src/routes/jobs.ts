import express, { Response } from 'express';
import { Job } from '../models/Job';
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

// POST new job (any authenticated user for analysis)
router.post('/', [auth], async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, skills, qualifications } = req.body;
    const job = new Job({ title, description, skills, qualifications });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
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
