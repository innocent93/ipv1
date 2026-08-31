const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  referenceNumber: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  resumeUrl: { type: String },
  coverLetter: { type: String, trim: true },
  linkedIn: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  yearsOfExperience: { type: Number, min: 0 },
  currentEmployer: { type: String, trim: true },
  noticePeriod: { type: String, trim: true },
  expectedSalary: { type: String, trim: true },
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'shortlisted', 'interview', 'rejected', 'hired', 'withdrawn'],
    default: 'submitted',
    index: true,
  },
  statusHistory: [{
    status: { type: String },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
  }],
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

jobApplicationSchema.index({ email: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
