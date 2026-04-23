import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['permanent', 'contract', 'temporary', 'apprenticeship'],
    default: 'permanent'
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: 'All India'
  },
  eligibility: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: 'Fresher'
  },
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  applicationStart: {
    type: Date,
    required: true
  },
  applicationEnd: {
    type: Date,
    required: true
  },
  ageLimit: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 35 }
  },
  applicationFee: {
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    ews: { type: Number, default: 0 }
  },
  selectionProcess: {
    type: String,
    default: ''
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

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
