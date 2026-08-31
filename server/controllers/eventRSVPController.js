const EventRSVP = require('../models/EventRSVP');
const logger = require('../utils/logger');

exports.createRSVP = async (req, res) => {
  try {
    const { eventId, name, email, phone, company, jobTitle, dietaryRequirements, attendanceType, notes } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Check for existing RSVP
    const existing = await EventRSVP.findOne({ eventId, email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already RSVP'd for this event with this email' });
    }

    const rsvp = await EventRSVP.create({
      eventId, name, email, phone, company, jobTitle, dietaryRequirements, attendanceType, notes,
      ipAddress, userAgent,
    });

    logger.info('Event RSVP created', { eventId, email });
    res.status(201).json({ success: true, data: rsvp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRSVPsByEvent = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const [rsvps, count] = await Promise.all([
      EventRSVP.find({ eventId: req.params.eventId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      EventRSVP.countDocuments({ eventId: req.params.eventId }),
    ]);
    res.status(200).json({
      success: true,
      data: rsvps,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRSVPStatus = async (req, res) => {
  try {
    const rsvp = await EventRSVP.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!rsvp) return res.status(404).json({ success: false, message: 'RSVP not found' });
    res.status(200).json({ success: true, data: rsvp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.cancelRSVP = async (req, res) => {
  try {
    const rsvp = await EventRSVP.findOneAndUpdate(
      { _id: req.params.id, email: req.body.email },
      { status: 'cancelled' },
      { new: true }
    );
    if (!rsvp) return res.status(404).json({ success: false, message: 'RSVP not found' });
    res.status(200).json({ success: true, message: 'RSVP cancelled', data: rsvp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
