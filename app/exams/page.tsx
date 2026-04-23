'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap, Search, MapPin, Calendar, ArrowRight, ExternalLink, Clock, Users, Loader2 } from 'lucide-react'

const examTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'upsc', label: 'UPSC' },
  { value: 'ssc', label: 'SSC' },
  { value: 'banking', label: 'Banking' },
  { value: 'defence', label: 'Defence' },
  { value: 'railway', label: 'Railway' },
  { value: 'state', label: 'State PSC' },
  { value: 'central', label: 'Central' },
  { value: 'other', label: 'Other' },
]

interface Exam {
  _id: string
  title: string
  description: string
  organization: string
  examType: string
  eligibility: string
  applicationStart: string
  applicationEnd: string
  examDate: string
  applicationFee: { general: number; obc: number; sc: number; st: number; ews: number }
  totalPosts: number
  ageLimit: { min: number; max: number }
  qualification: string
  state: string
  url: string
  isActive: boolean
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [examType, setExamType] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true)
        const res = await fetch('/api/exams')
        if (!res.ok) throw new Error('Failed to fetch exams')
        const data = await res.json()
        if (data.success) {
          setExams(data.exams)
        } else {
          setError(data.message || 'Failed to load exams')
        }
      } catch (err: any) {
        setError(err.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }
    fetchExams()
  }, [])

  const filteredExams = exams.filter(exam => {
    const matchesType = examType === 'all' || exam.examType === examType
    const matchesSearch = !search ||
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.description.toLowerCase().includes(search.toLowerCase()) ||
      exam.organization.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch && exam.isActive
  })

  const getDaysLeft = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const examTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      upsc: 'bg-purple-100 text-purple-700',
      ssc: 'bg-blue-100 text-blue-700',
      banking: 'bg-green-100 text-green-700',
      defence: 'bg-red-100 text-red-700',
      railway: 'bg-orange-100 text-orange-700',
      state: 'bg-cyan-100 text-cyan-700',
      central: 'bg-indigo-100 text-indigo-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-india-blue/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-india-blue" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Competitive Exams
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            AI-curated upcoming government competitive examinations across India
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            🤖 AI Auto-Fetched from Google — {exams.length} Exams Available
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
                placeholder="Search exams by name, organization..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
            >
              {examTypeOptions.map(o => (
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
            <Loader2 className="h-8 w-8 animate-spin text-india-blue mr-3" />
            <span className="text-gray-600 dark:text-gray-400">AI is curating latest competitive exams...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const daysLeft = getDaysLeft(exam.applicationEnd)
              const isUrgent = daysLeft <= 7 && daysLeft > 0
              const isExpired = daysLeft <= 0

              return (
                <div key={exam._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-blue transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.title}</h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase ${examTypeBadge(exam.examType)}`}>
                              {exam.examType}
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

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {exam.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {exam.organization}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exam.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(exam.totalPosts || 0).toLocaleString()} posts
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Exam: {new Date(exam.examDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Application Start</div>
                            <div className="font-medium text-sm">{new Date(exam.applicationStart).toLocaleDateString('en-IN')}</div>
                          </div>
                          <div className={`rounded-lg p-3 text-center ${isUrgent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                            <div className={`text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>Last Date</div>
                            <div className={`font-medium text-sm ${isUrgent ? 'text-red-600' : ''}`}>
                              {new Date(exam.applicationEnd).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Age Limit</div>
                            <div className="font-medium text-sm">{exam.ageLimit?.min || 18}-{exam.ageLimit?.max || 30} years</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Fee (Gen)</div>
                            <div className="font-medium text-sm">₹{exam.applicationFee?.general || 0}</div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Eligibility:</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{exam.eligibility}</span>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                        {exam.url && (
                          <a
                            href={exam.url}
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
                            href={`/apply?type=exam&id=${exam._id}`}
                            className="px-4 py-2 bg-india-blue text-white text-sm font-medium rounded-lg hover:bg-india-blue/90 transition-colors flex items-center justify-center gap-1"
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

        {!loading && filteredExams.length === 0 && !error && (
          <div className="text-center py-16">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No exams found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or exam type filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
