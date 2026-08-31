const Service = require('../models/Service');
const { sanitizeRelaxed, sanitizePlainText } = require('../utils/sanitizer');

exports.getAllServices = async () => await Service.find({ isActive: true }).sort({ order: 1 });
exports.getServiceBySlug = async (slug) => await Service.findOne({ slug, isActive: true });

exports.createService = async (data) => {
  const sanitized = {
    ...data,
    title: sanitizePlainText(data.title),
    shortDescription: sanitizePlainText(data.shortDescription),
    fullDescription: sanitizeRelaxed(data.fullDescription),
    features: data.features?.map(f => sanitizePlainText(f)),
    benefits: data.benefits?.map(b => sanitizePlainText(b)),
    metaTitle: data.metaTitle ? sanitizePlainText(data.metaTitle) : undefined,
    metaDescription: data.metaDescription ? sanitizePlainText(data.metaDescription) : undefined,
  };
  return Service.create(sanitized);
};

exports.updateService = async (id, data) => {
  const sanitized = {
    ...data,
    title: data.title ? sanitizePlainText(data.title) : undefined,
    shortDescription: data.shortDescription ? sanitizePlainText(data.shortDescription) : undefined,
    fullDescription: data.fullDescription ? sanitizeRelaxed(data.fullDescription) : undefined,
    features: data.features ? data.features.map(f => sanitizePlainText(f)) : undefined,
    benefits: data.benefits ? data.benefits.map(b => sanitizePlainText(b)) : undefined,
    metaTitle: data.metaTitle ? sanitizePlainText(data.metaTitle) : undefined,
    metaDescription: data.metaDescription ? sanitizePlainText(data.metaDescription) : undefined,
  };
  return Service.findByIdAndUpdate(id, sanitized, { new: true, runValidators: true });
};

exports.deleteService = async (id) => await Service.findByIdAndDelete(id);
