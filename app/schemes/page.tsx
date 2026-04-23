'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, Search, ArrowRight, MapPin, Calendar, ExternalLink, Loader2 } from 'lucide-react'

const schemeCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'housing', label: 'Housing' },
  { value: 'finance', label: 'Finance' },
  { value: 'employment', label: 'Employment' },
  { value: 'social-welfare', label: 'Social Welfare' },
  { value: 'skill-development', label: 'Skill Development' },
]

interface Scheme {
  _id: string
  title: string
  description: string
  organization: string
  ministry: string
  category: string
  eligibility: string
  benefits: string
  deadline: string
  state: string
  url: string
  totalApplications: number
  isActive: boolean
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchSchemes() {
      try {
        setLoading(true)
        const res = await fetch('/api/schemes')
        if (!res.ok) throw new Error('Failed to fetch schemes')
        const data = await res.json()
        if (data.success) {
          setSchemes(data.schemes)
        } else {
          setError(data.message || 'Failed to load schemes')
        }
      } catch (err: any) {
        setError(err.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [])

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = category === 'all' || scheme.category === category
    const matchesSearch = !search ||
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase()) ||
      scheme.organization.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch && scheme.isActive
  })

  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      agriculture: 'bg-green-100 text-green-700',
      health: 'bg-red-100 text-red-700',
      housing: 'bg-blue-100 text-blue-700',
      education: 'bg-purple-100 text-purple-700',
      finance: 'bg-yellow-100 text-yellow-700',
      employment: 'bg-orange-100 text-orange-700',
      'social-welfare': 'bg-pink-100 text-pink-700',
      'skill-development': 'bg-cyan-100 text-cyan-700',
    }
    return colors[cat] || 'bg-gray-100 text-gray-700'
  }

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
            AI-curated welfare schemes from the Government of India — discover and apply
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            🤖 AI Auto-Fetched from Google — {schemes.length} Schemes Available
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
                placeholder="Search schemes by name, ministry..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white"
            >
              {schemeCategories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
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
            <span className="text-gray-600 dark:text-gray-400">AI is curating latest government schemes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-india-saffron transition-all hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">{scheme.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap ${categoryColor(scheme.category)}`}>
                      {scheme.category.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {scheme.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{scheme.ministry || scheme.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      {scheme.state}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      <span className="font-medium">Benefits:</span> {scheme.benefits}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(scheme.totalApplications || 0).toLocaleString()} applications
                    </span>
                    <div className="flex gap-2">
                      {scheme.url && (
                        <a
                          href={scheme.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-sm text-gray-600 hover:text-india-blue border border-gray-300 dark:border-gray-600 rounded-lg hover:border-india-blue transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Details
                        </a>
                      )}
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

        {!loading && filteredSchemes.length === 0 && !error && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No schemes found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
