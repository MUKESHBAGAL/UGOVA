'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, Search, MapPin, Calendar, ArrowRight, ExternalLink, Clock, IndianRupee, Users, Loader2 } from 'lucide-react'

const jobTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
]

interface Job {
  _id: string
  title: string
  description: string
  organization: string
  department: string
  jobType: string
  location: string
  state: string
  eligibility: string
  qualification: string
  experience: string
  salaryRange: { min: number; max: number }
  totalPosts: number
  applicationStart: string
  applicationEnd: string
  ageLimit: { min: number; max: number }
  applicationFee: { general: number; obc: number; sc: number; st: number; ews: number }
  selectionProcess: string
  url: string
  isActive: boolean
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [jobType, setJobType] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const res = await fetch('/api/jobs')
        if (!res.ok) throw new Error('Failed to fetch jobs')
        const data = await res.json()
        if (data.success) {
          setJobs(data.jobs)
        } else {
          setError(data.message || 'Failed to load jobs')
        }
      } catch (err: any) {
        setError(err.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesType = jobType === 'all' || job.jobType === jobType
    const matchesSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.organization.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch && job.isActive
  })

  const getDaysLeft = (date: string) => {
    return Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const formatSalary = (min: number, max: number) => {
    const format = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`
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
            AI-curated latest job openings across central and state government departments
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            🤖 AI Auto-Fetched from Google — {jobs.length} Jobs Available
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Data refreshes automatically every 30 minutes via simulated Google Search + AI extraction
          </div>
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
                placeholder="Search jobs by title, department, organization..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
            >
              {jobTypeOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-india-green mr-3" />
            <span className="text-gray-600 dark:text-gray-400">AI is curating latest government jobs...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const daysLeft = getDaysLeft(job.applicationEnd)
              const isUrgent = daysLeft <= 7 && daysLeft > 0
              const isExpired = daysLeft <= 0

              return (
                <div key={job._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-green transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                              job.jobType === 'permanent'
                                ? 'bg-green-100 text-green-700'
                                : job.jobType === 'contract'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.jobType}
                            </span>
                            {isUrgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {daysLeft}d left
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                                Closed
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
                            {formatSalary(job.salaryRange?.min || 0, job.salaryRange?.max || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(job.totalPosts || 0).toLocaleString()} posts
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {job.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className={`rounded-lg p-3 text-center ${isUrgent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                            <div className={`text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>Last Date</div>
                            <div className={`font-medium text-sm ${isUrgent ? 'text-red-600' : ''}`}>
                              {new Date(job.applicationEnd).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Age Limit</div>
                            <div className="font-medium text-sm">{job.ageLimit?.min || 18}-{job.ageLimit?.max || 30} yrs</div>
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

                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm mb-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Eligibility:</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{job.eligibility}</span>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Selection:</span> {job.selectionProcess}
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm text-gray-600 hover:text-india-blue border border-gray-300 dark:border-gray-600 rounded-lg hover:border-india-blue transition-colors flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Details
                          </a>
                        )}
                        {!isExpired && (
                          <Link
                            href={`/apply?type=job&id=${job._id}`}
                            className="px-4 py-2 bg-india-green text-white text-sm font-medium rounded-lg hover:bg-india-green/90 transition-colors flex items-center justify-center gap-1"
                          >
                            Apply
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && !error && (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or job type filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
