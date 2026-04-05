import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [String],
  qualifications: [String],
  last_updated: { type: Date, default: Date.now },
}, { timestamps: true });

export const Job = mongoose.model('Job', JobSchema);
