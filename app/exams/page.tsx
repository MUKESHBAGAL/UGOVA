'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Search, MapPin, Calendar, ArrowRight, ExternalLink, Clock, Users, Loader2 } from 'lucide-react'

const examTypes = ['all', 'central', 'state', 'banking', 'defence', 'railway', 'ssc', 'upsc']

const mockExams = [
  {
    _id: '1',
    title: 'UPSC Civil Services Examination 2024',
    description: 'Civil Services (Preliminary) Examination for IAS, IPS, IFS and other central services.',
    organization: 'Union Public Service Commission',
    examType: 'upsc',
    eligibility: 'Graduate in any discipline from recognized university',
    applicationStart: '2024-02-14',
    applicationEnd: '2024-03-05',
    examDate: '2024-05-26',
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 1056,
    ageLimit: { min: 21, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://upsc.gov.in'
  },
  {
    _id: '2',
    title: 'SSC CGL 2024',
    description: 'Combined Graduate Level Examination for Group B and C posts in various ministries.',
    organization: 'Staff Selection Commission',
    examType: 'ssc',
    eligibility: 'Graduate from recognized university',
    applicationStart: '2024-06-11',
    applicationEnd: '2024-07-10',
    examDate: '2024-09-15',
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 7500,
    ageLimit: { min: 18, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ssc.gov.in'
  },
  {
    _id: '3',
    title: 'IBPS PO 2024',
    description: 'Probationary Officer recruitment in participating public sector banks.',
    organization: 'Institute of Banking Personnel Selection',
    examType: 'banking',
    eligibility: 'Graduate in any discipline',
    applicationStart: '2024-07-01',
    applicationEnd: '2024-07-21',
    examDate: '2024-10-19',
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    totalPosts: 4872,
    ageLimit: { min: 20, max: 30 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ibps.in'
  },
  {
    _id: '4',
    title: 'NDA & NA Examination (I) 2024',
    description: 'National Defence Academy and Naval Academy examination for Army, Navy, and Air Force.',
    organization: 'Union Public Service Commission',
    examType: 'defence',
    eligibility: '12th pass or appearing in Physics, Chemistry, and Mathematics',
    applicationStart: '2024-12-20',
    applicationEnd: '2024-01-09',
    examDate: '2024-04-21',
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 400,
    ageLimit: { min: 16, max: 19 },
    qualification: '12th Pass',
    state: 'All India',
    url: 'https://upsc.gov.in'
  },
  {
    _id: '5',
    title: 'RRB NTPC 2024',
    description: 'Non-Technical Popular Categories recruitment in Indian Railways.',
    organization: 'Railway Recruitment Board',
    examType: 'railway',
    eligibility: '12th pass or Graduate depending on post',
    applicationStart: '2024-08-01',
    applicationEnd: '2024-08-30',
    examDate: '2024-12-15',
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    totalPosts: 35000,
    ageLimit: { min: 18, max: 33 },
    qualification: '12th Pass / Graduate',
    state: 'All India',
    url: 'https://rrbcdg.gov.in'
  },
  {
    _id: '6',
    title: 'State PSC Combined Exam 2024',
    description: 'State Public Service Commission combined examination for various state government posts.',
    organization: 'State Public Service Commission',
    examType: 'state',
    eligibility: 'Graduate from recognized university',
    applicationStart: '2024-03-01',
    applicationEnd: '2024-03-31',
    examDate: '2024-06-20',
    applicationFee: { general: 500, obc: 500, sc: 200, st: 200, ews: 500 },
    totalPosts: 2500,
    ageLimit: { min: 21, max: 38 },
    qualification: 'Graduate',
    state: 'Maharashtra',
    url: 'https://mpsc.gov.in'
  }
]

export default function ExamsPage() {
  const [exams] = useState(mockExams)
  const [examType, setExamType] = useState('all')
  const [search, setSearch] = useState('')

  const filteredExams = exams.filter(exam => {
    const matchesType = examType === 'all' || exam.examType === examType
    const matchesSearch = !search || 
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.organization.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const getDaysLeft = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
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
            Find and apply for upcoming government competitive examinations
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
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="upsc">UPSC</option>
              <option value="ssc">SSC</option>
              <option value="banking">Banking</option>
              <option value="defence">Defence</option>
              <option value="railway">Railway</option>
              <option value="state">State PSC</option>
              <option value="central">Central</option>
            </select>
          </div>
        </div>

        {/* Exam Cards */}
        <div className="space-y-4">
          {filteredExams.map((exam) => {
            const daysLeft = getDaysLeft(exam.applicationEnd)
            const isUrgent = daysLeft <= 7 && daysLeft > 0
            
            return (
              <div key={exam._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-blue transition-all card-hover">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exam.title}</h3>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-india-blue/10 text-india-blue text-xs font-medium rounded-full uppercase">
                            {exam.examType}
                          </span>
                          {isUrgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Urgent
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
                          {exam.totalPosts.toLocaleString()} posts
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
                          <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>Last Date</div>
                          <div className={`font-medium text-sm ${isUrgent ? 'text-red-600' : ''}`}>
                            {new Date(exam.applicationEnd).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Age Limit</div>
                          <div className="font-medium text-sm">{exam.ageLimit.min}-{exam.ageLimit.max} years</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Fee (Gen)</div>
                          <div className="font-medium text-sm">₹{exam.applicationFee.general}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Eligibility:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{exam.eligibility}</span>
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                      <a 
                        href={exam.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-gray-600 hover:text-india-blue border border-gray-300 dark:border-gray-600 rounded-lg hover:border-india-blue transition-colors flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Details
                      </a>
                      <Link 
                        href={`/apply?type=exam&id=${exam._id}`}
                        className="px-4 py-2 bg-india-blue text-white text-sm font-medium rounded-lg hover:bg-india-blue/90 transition-colors flex items-center justify-center gap-1"
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

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No exams found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
