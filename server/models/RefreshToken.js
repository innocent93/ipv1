const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  revokedAt: { type: Date },
  replacedByToken: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

// Auto-expire documents past their expiration date
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

refreshTokenSchema.methods.isRevoked = function() {
  return !!this.revokedAt;
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
