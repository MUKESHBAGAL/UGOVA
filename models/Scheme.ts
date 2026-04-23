import mongoose from 'mongoose'

const SchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  ministry: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['education', 'health', 'agriculture', 'housing', 'finance', 'employment', 'social-welfare', 'skill-development', 'other'],
    default: 'other'
  },
  eligibility: {
    type: String,
    required: true
  },
  benefits: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  state: {
    type: String,
    default: 'All India'
  },
  url: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema)
