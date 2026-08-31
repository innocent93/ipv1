const crypto = require('crypto');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const logger = require('../utils/logger');

const generateReference = () => 'IPMC-' + crypto.randomBytes(3).toString('hex').toUpperCase();

exports.submitApplication = async (req, res) => {
  try {
    const { jobId, firstName, lastName, email, phone, coverLetter, linkedIn, portfolio, yearsOfExperience, currentEmployer, noticePeriod, expectedSalary } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Verify job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer accepting applications' });
    }

    // Check for duplicate application
    const existing = await JobApplication.findOne({ jobId, email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied for this position', referenceNumber: existing.referenceNumber });
    }

    const referenceNumber = generateReference();

    const application = await JobApplication.create({
      jobId, referenceNumber, firstName, lastName, email, phone,
      coverLetter, linkedIn, portfolio, yearsOfExperience, currentEmployer, noticePeriod, expectedSalary,
      ipAddress, userAgent,
      statusHistory: [{ status: 'submitted', note: 'Application received' }],
    });

    logger.info('Job application submitted', { referenceNumber, jobId, email });
    res.status(201).json({ success: true, data: { referenceNumber, status: application.status, submittedAt: application.createdAt } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.trackApplication = async (req, res) => {
  try {
    const { referenceNumber, email } = req.body;

    const application = await JobApplication.findOne({ referenceNumber, email })
      .populate('jobId', 'title department location')
      .select('referenceNumber status statusHistory firstName lastName jobId createdAt updatedAt');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found. Please check your reference number and email.' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { jobId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const [applications, count] = await Promise.all([
      JobApplication.find(filter)
        .populate('jobId', 'title department')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      JobApplication.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    application.statusHistory.push({ status, note, updatedBy: req.user.id });
    await application.save();

    logger.info('Application status updated', { applicationId: application._id, status });
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
