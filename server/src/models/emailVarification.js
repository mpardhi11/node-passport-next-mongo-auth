import mongoose from 'mongoose';

// Schema
const emailVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  verificationCode: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: '10m' },
});

// Model
const emailVerification = mongoose.model('emailVerification', emailVerificationSchema);

export default emailVerification;
