const mongoose = require('mongoose');

const eventRSVPSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  jobTitle: { type: String, trim: true },
  dietaryRequirements: { type: String, trim: true },
  attendanceType: { type: String, enum: ['in-person', 'virtual'], default: 'in-person' },
  status: { type: String, enum: ['confirmed', 'waitlist', 'cancelled', 'attended'], default: 'confirmed' },
  notes: { type: String, trim: true },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

eventRSVPSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('EventRSVP', eventRSVPSchema);
