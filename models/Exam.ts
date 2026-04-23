import mongoose from 'mongoose'

const ExamSchema = new mongoose.Schema({
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
  examType: {
    type: String,
    enum: ['central', 'state', 'banking', 'defence', 'railway', 'ssc', 'upsc', 'other'],
    default: 'other'
  },
  eligibility: {
    type: String,
    required: true
  },
  applicationStart: {
    type: Date,
    required: true
  },
  applicationEnd: {
    type: Date,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  admitCardDate: {
    type: Date,
    default: null
  },
  resultDate: {
    type: Date,
    default: null
  },
  applicationFee: {
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    ews: { type: Number, default: 0 }
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  ageLimit: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 35 }
  },
  qualification: {
    type: String,
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

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema)
