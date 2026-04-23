'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, Search, MapPin, Calendar, ArrowRight, ExternalLink, Clock, IndianRupee, Users } from 'lucide-react'

const jobTypes = ['all', 'permanent', 'contract', 'temporary', 'apprenticeship']

const mockJobs = [
  {
    _id: '1',
    title: 'SSC CGL - Assistant Section Officer',
    description: 'Assistant Section Officer in various Central Government Ministries and Departments.',
    organization: 'Staff Selection Commission',
    department: 'Central Secretariat Service',
    jobType: 'permanent',
    location: 'Delhi, Mumbai, Kolkata, Chennai',
    state: 'All India',
    eligibility: 'Graduate from recognized university with Computer Proficiency',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 44900, max: 142400 },
    totalPosts: 3600,
    applicationStart: '2024-06-11',
    applicationEnd: '2024-07-10',
    ageLimit: { min: 18, max: 30 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Tier-I Computer Exam, Tier-II Computer Exam, Document Verification',
    url: 'https://ssc.gov.in'
  },
  {
    _id: '2',
    title: 'IBPS PO - Probationary Officer',
    description: 'Probationary Officer in participating public sector banks across India.',
    organization: 'Institute of Banking Personnel Selection',
    department: 'Public Sector Banks',
    jobType: 'permanent',
    location: 'Pan India',
    state: 'All India',
    eligibility: 'Graduate in any discipline from recognized University',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 36000, max: 63000 },
    totalPosts: 4872,
    applicationStart: '2024-07-01',
    applicationEnd: '2024-07-21',
    ageLimit: { min: 20, max: 30 },
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    selectionProcess: 'Preliminary Exam, Mains Exam, Interview',
    url: 'https://ibps.in'
  },
  {
    _id: '3',
    title: 'Indian Railways - RRB NTPC',
    description: 'Various Non-Technical Popular Categories posts in Indian Railways.',
    organization: 'Railway Recruitment Board',
    department: 'Indian Railways',
    jobType: 'permanent',
    location: 'All Zonal Railways',
    state: 'All India',
    eligibility: '12th Pass or Graduate depending on post',
    qualification: '12th Pass / Graduate',
    experience: 'Fresher',
    salaryRange: { min: 19900, max: 44900 },
    totalPosts: 35000,
    applicationStart: '2024-08-01',
    applicationEnd: '2024-08-30',
    ageLimit: { min: 18, max: 33 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    selectionProcess: 'CBT Stage 1, CBT Stage 2, Skill Test/Document Verification',
    url: 'https://rrbcdg.gov.in'
  },
  {
    _id: '4',
    title: 'UPSC Civil Services - IAS Officer',
    description: 'Indian Administrative Service officer positions across various state cadres.',
    organization: 'Union Public Service Commission',
    department: 'Indian Administrative Service',
    jobType: 'permanent',
    location: 'All India Cadre',
    state: 'All India',
    eligibility: 'Graduate in any discipline from recognized university',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 56100, max: 250000 },
    totalPosts: 180,
    applicationStart: '2024-02-14',
    applicationEnd: '2024-03-05',
    ageLimit: { min: 21, max: 32 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Prelims, Mains, Interview, Medical Examination',
    url: 'https://upsc.gov.in'
  },
  {
    _id: '5',
    title: 'State Police Constable',
    description: 'Police Constable recruitment in State Police Department.',
    organization: 'State Police Recruitment Board',
    department: 'State Police Department',
    jobType: 'permanent',
    location: 'State-wide',
    state: 'Maharashtra',
    eligibility: '12th Pass from recognized board, Physical fitness required',
    qualification: '12th Pass',
    experience: 'Fresher',
    salaryRange: { min: 21700, max: 69100 },
    totalPosts: 12000,
    applicationStart: '2024-09-01',
    applicationEnd: '2024-09-30',
    ageLimit: { min: 18, max: 28 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 500 },
    selectionProcess: 'Written Exam, Physical Test, Medical Test, Document Verification',
    url: 'https://mahapolice.gov.in'
  },
  {
    _id: '6',
    title: 'Defence - Agniveer (Army)',
    description: 'Short-term military service opportunity under Agnipath Scheme.',
    organization: 'Indian Army',
    department: 'Ministry of Defence',
    jobType: 'contract',
    location: 'All India',
    state: 'All India',
    eligibility: '10th/12th Pass, Physical and Medical Standards',
    qualification: '10th/12th Pass',
    experience: 'Fresher',
    salaryRange: { min: 30000, max: 40000 },
    totalPosts: 25000,
    applicationStart: '2024-01-01',
    applicationEnd: '2024-02-15',
    ageLimit: { min: 17, max: 23 },
    applicationFee: { general: 0, obc: 0, sc: 0, st: 0, ews: 0 },
    selectionProcess: 'Physical Fitness Test, Medical Examination, Written Exam',
    url: 'https://joinindianarmy.nic.in'
  }
]

export default function JobsPage() {
  const [jobs] = useState(mockJobs)
  const [jobType, setJobType] = useState('all')
  const [search, setSearch] = useState('')

  const filteredJobs = jobs.filter(job => {
    const matchesType = jobType === 'all' || job.jobType === jobType
    const matchesSearch = !search || 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.organization.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const getDaysLeft = (date: string) => {
    return Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const formatSalary = (min: number, max: number) => {
    const format = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`
    return `${format(min)} - ${format(max)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-india-green/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-india-green" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Government Jobs
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Latest job openings across central and state government departments
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, department..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="apprenticeship">Apprenticeship</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysLeft(job.applicationEnd)
            const isUrgent = daysLeft <= 7 && daysLeft > 0
            
            return (
              <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-green transition-all card-hover">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                            job.jobType === 'permanent' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.jobType}
                          </span>
                          {isUrgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {daysLeft}d left
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.organization}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {formatSalary(job.salaryRange.min, job.salaryRange.max)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.totalPosts.toLocaleString()} posts
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {job.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Last Date</div>
                          <div className={`font-medium text-sm ${isUrgent ? 'text-red-600' : ''}`}>
                            {new Date(job.applicationEnd).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Age Limit</div>
                          <div className="font-medium text-sm">{job.ageLimit.min}-{job.ageLimit.max} yrs</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Qualification</div>
                          <div className="font-medium text-sm">{job.qualification}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Experience</div>
                          <div className="font-medium text-sm">{job.experience}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm mb-4">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Eligibility:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{job.eligibility}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Selection:</span> {job.selectionProcess}
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                      <a 
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-gray-600 hover:text-india-blue border border-gray-300 dark:border-gray-600 rounded-lg hover:border-india-blue transition-colors flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Details
                      </a>
                      <Link 
                        href={`/apply?type=job&id=${job._id}`}
                        className="px-4 py-2 bg-india-green text-white text-sm font-medium rounded-lg hover:bg-india-green/90 transition-colors flex items-center justify-center gap-1"
                      >
                        Apply
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
