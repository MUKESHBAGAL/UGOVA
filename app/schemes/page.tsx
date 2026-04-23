'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, Search, Filter, ArrowRight, MapPin, Calendar, ExternalLink, Loader2 } from 'lucide-react'

const schemeCategories = [
  'all', 'education', 'health', 'agriculture', 'housing', 
  'finance', 'employment', 'social-welfare', 'skill-development'
]

const mockSchemes = [
  {
    _id: '1',
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of Rs. 6000 per year to farmer families across the country.',
    organization: 'Ministry of Agriculture',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'agriculture',
    eligibility: 'Small and marginal farmer families having cultivable land',
    benefits: 'Rs. 6000 per year in three installments',
    deadline: '2024-12-31',
    state: 'All India',
    url: 'https://pmkisan.gov.in',
    totalApplications: 125000
  },
  {
    _id: '2',
    title: 'Pradhan Mantri Awas Yojana',
    description: 'Housing for All scheme providing affordable housing to urban and rural poor.',
    organization: 'Ministry of Housing',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'housing',
    eligibility: 'EWS/LIG households without pucca house',
    benefits: 'Interest subsidy up to Rs. 2.67 lakh on home loans',
    deadline: '2024-12-31',
    state: 'All India',
    url: 'https://pmaymis.gov.in',
    totalApplications: 89000
  },
  {
    _id: '3',
    title: 'National Scholarship Portal',
    description: 'Single window for various scholarship schemes for students.',
    organization: 'Ministry of Education',
    ministry: 'Ministry of Education',
    category: 'education',
    eligibility: 'Students from SC/ST/OBC/Minority/General categories',
    benefits: 'Scholarship amount from Rs. 10,000 to Rs. 2 lakh per year',
    deadline: '2024-10-31',
    state: 'All India',
    url: 'https://scholarships.gov.in',
    totalApplications: 234000
  },
  {
    _id: '4',
    title: 'Ayushman Bharat Yojana',
    description: 'Worlds largest government-funded healthcare program covering 50 crore beneficiaries.',
    organization: 'National Health Authority',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'health',
    eligibility: 'Families identified in SECC 2011 database',
    benefits: 'Health coverage up to Rs. 5 lakh per family per year',
    deadline: '2024-12-31',
    state: 'All India',
    url: 'https://pmjay.gov.in',
    totalApplications: 456000
  },
  {
    _id: '5',
    title: 'Skill India Mission',
    description: 'National Skill Development Mission to train over 40 crore people in different skills.',
    organization: 'Ministry of Skill Development',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    category: 'skill-development',
    eligibility: 'Youth aged 15-45 years',
    benefits: 'Free skill training with certification and placement support',
    deadline: '2024-12-31',
    state: 'All India',
    url: 'https://skillindia.gov.in',
    totalApplications: 178000
  },
  {
    _id: '6',
    title: 'MUDRA Loan Scheme',
    description: 'Micro Units Development and Refinance Agency for non-corporate small business loans.',
    organization: 'SIDBI',
    ministry: 'Ministry of Finance',
    category: 'finance',
    eligibility: 'Small business owners, entrepreneurs, shopkeepers',
    benefits: 'Loans from Rs. 50,000 to Rs. 10 lakh at subsidized rates',
    deadline: '2024-12-31',
    state: 'All India',
    url: 'https://mudra.org.in',
    totalApplications: 312000
  }
]

export default function SchemesPage() {
  const [schemes, setSchemes] = useState(mockSchemes)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [state, setState] = useState('all')

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = category === 'all' || scheme.category === category
    const matchesSearch = !search || 
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase())
    const matchesState = state === 'all' || scheme.state === state || scheme.state === 'All India'
    return matchesCategory && matchesSearch && matchesState
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-india-saffron/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-india-saffron" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Government Schemes
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Discover and apply for welfare schemes from the Government of India
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
                placeholder="Search schemes..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="agriculture">Agriculture</option>
                <option value="housing">Housing</option>
                <option value="finance">Finance</option>
                <option value="employment">Employment</option>
                <option value="social-welfare">Social Welfare</option>
                <option value="skill-development">Skill Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-india-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-saffron transition-all card-hover">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{scheme.title}</h3>
                    <span className="px-2 py-1 bg-india-saffron/10 text-india-saffron text-xs font-medium rounded-full capitalize whitespace-nowrap">
                      {scheme.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {scheme.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="h-4 w-4" />
                      {scheme.ministry}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {scheme.state}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {scheme.totalApplications.toLocaleString()} applications
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={scheme.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-sm text-gray-600 hover:text-india-blue border border-gray-300 dark:border-gray-600 rounded-lg hover:border-india-blue transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Details
                      </a>
                      <Link 
                        href={`/apply?type=scheme&id=${scheme._id}`}
                        className="px-4 py-2 bg-india-saffron text-white text-sm font-medium rounded-lg hover:bg-india-saffron/90 transition-colors flex items-center gap-1"
                      >
                        Apply
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No schemes found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
