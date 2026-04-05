import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import cvRoutes from './routes/cvs';
import { User } from './models/User';
import { auth, adminOnly } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brainhire';

// Connect to MongoDB
const uriMasked = MONGODB_URI.substring(0, 15) + '...';
console.log(`Connecting to database at: ${uriMasked}`);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Success: Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ CRITICAL: MongoDB connection failed:', err.message);
    // On Render, we should let it try to restart
  });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/cvs', cvRoutes);

// Admin-only User management
app.get('/api/users', [auth, adminOnly], async (req: any, res: any) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/health', (_: express.Request, res: express.Response) => {
  console.log('Health check Heartbeat received');
  res.json({ status: 'ok', message: 'BrainHireAI Backend is live with MongoDB.' });
});

app.listen(port, () => {
  console.log(`>>> BrainHireAI Engine running at http://localhost:${port}`);
});
