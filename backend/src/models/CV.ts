import mongoose from 'mongoose';

const CVSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String }, // Local path for now
  candidateName: { type: String },
  matchedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'analyzed', 'rejected', 'hired'], default: 'pending' },
  analysis: {
      reasoning: String,
      matchedKeywords: [String]
  }
}, { timestamps: true });

export const CV = mongoose.model('CV', CVSchema);
