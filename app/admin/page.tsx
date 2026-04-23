'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  Shield, Users, Building2, GraduationCap, Briefcase, 
  TrendingUp, CheckCircle, XCircle, Clock, BarChart3,
  FileCheck, AlertTriangle, ArrowUp, ArrowDown,
  Search, RefreshCw, BrainCircuit, Loader2
} from 'lucide-react'

const mockStats = {
  totalUsers: 12543,
  pendingVerifications: 234,
  verifiedUsers: 11876,
  totalApplications: 45678,
  schemesActive: 156,
  examsActive: 89,
  jobsActive: 234,
  newUsersToday: 156
}

const mockChartData = [
  { month: 'Jan', users: 1200, applications: 3400 },
  { month: 'Feb', users: 1900, applications: 4100 },
  { month: 'Mar', users: 2400, applications: 5200 },
  { month: 'Apr', users: 2800, applications: 6100 },
  { month: 'May', users: 3200, applications: 6800 },
  { month: 'Jun', users: 3800, applications: 7500 },
]

const mockPendingUsers = [
  { _id: '1', fullName: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', category: 'General', submittedAt: '2 hours ago' },
  { _id: '2', fullName: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', category: 'OBC', submittedAt: '5 hours ago' },
  { _id: '3', fullName: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', category: 'SC', submittedAt: '1 day ago' },
  { _id: '4', fullName: 'Sneha Gupta', email: 'sneha@example.com', phone: '+91 98765 43213', category: 'General', submittedAt: '1 day ago' },
  { _id: '5', fullName: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', category: 'ST', submittedAt: '2 days ago' },
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState<string | false>(false)
  const [dataCounts, setDataCounts] = useState({ schemes: 0, exams: 0, jobs: 0 })
  const [refreshMessage, setRefreshMessage] = useState('')
  const [cacheStats, setCacheStats] = useState<any>(null)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [sRes, eRes, jRes, cacheRes] = await Promise.all([
          fetch('/api/schemes'),
          fetch('/api/exams'),
          fetch('/api/jobs'),
          fetch('/api/refresh')
        ])
        const [sData, eData, jData, cacheData] = await Promise.all([sRes.json(), eRes.json(), jRes.json(), cacheRes.json()])
        setDataCounts({
          schemes: sData.schemes?.length || 0,
          exams: eData.exams?.length || 0,
          jobs: jData.jobs?.length || 0
        })
        if (cacheData.success) {
          setCacheStats(cacheData.cache)
        }
      } catch (e) {
        console.error('Failed to fetch counts:', e)
      }
    }
    fetchCounts()
  }, [refreshing])

  const handleGoogleRefresh = async (category: 'scheme' | 'exam' | 'job' | 'all') => {
    setRefreshing(category)
    setRefreshMessage(`🤖 AI is fetching ${category === 'all' ? 'all' : category} data from Google Search...`)
    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      const data = await res.json()
      if (data.success) {
        setRefreshMessage(`✅ ${data.message}`)
        // Refresh counts
        const [sRes, eRes, jRes] = await Promise.all([
          fetch('/api/schemes'),
          fetch('/api/exams'),
          fetch('/api/jobs')
        ])
        const [sData, eData, jData] = await Promise.all([sRes.json(), eRes.json(), jRes.json()])
        setDataCounts({
          schemes: sData.schemes?.length || 0,
          exams: eData.exams?.length || 0,
          jobs: jData.jobs?.length || 0
        })
        // Refresh cache stats
        const cacheRes = await fetch('/api/refresh')
        const cacheData = await cacheRes.json()
        if (cacheData.success) setCacheStats(cacheData.cache)
      } else {
        setRefreshMessage(`❌ ${data.message}`)
      }
      setTimeout(() => setRefreshMessage(''), 5000)
    } catch (e) {
      setRefreshMessage('❌ Refresh failed. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-india-blue" />
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  const filteredUsers = mockPendingUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'verifications', label: 'Verifications', icon: FileCheck },
    { id: 'data', label: 'Google AI Data', icon: BrainCircuit },
    { id: 'users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-india-navy/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-india-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage verifications, users, and AI-powered Google data feeds</p>
            </div>
          </div>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-india-blue shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-india-blue/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-india-blue" />
                  </div>
                  <span className="flex items-center text-green-600 text-xs font-medium"><ArrowUp className="h-3 w-3 mr-0.5" />+12%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="flex items-center text-yellow-600 text-xs font-medium"><AlertTriangle className="h-3 w-3 mr-0.5" />Pending</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.pendingVerifications}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pending Verifications</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-xs font-medium"><ArrowUp className="h-3 w-3 mr-0.5" />+8%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.verifiedUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Verified Users</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-xs font-medium"><ArrowUp className="h-3 w-3 mr-0.5" />+23%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalApplications.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Applications</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-india-saffron/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-india-saffron" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{dataCounts.schemes || mockStats.schemesActive}</div>
                  <div className="text-sm text-gray-500">Google AI-Fetched Schemes</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-india-blue/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-india-blue" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{dataCounts.exams || mockStats.examsActive}</div>
                  <div className="text-sm text-gray-500">Google AI-Fetched Exams</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-india-green/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-india-green" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{dataCounts.jobs || mockStats.jobsActive}</div>
                  <div className="text-sm text-gray-500">Google AI-Fetched Jobs</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Growth & Applications</h2>
              <div className="flex items-end gap-2 h-64">
                {mockChartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 items-end">
                      <div className="flex-1 bg-india-blue/80 rounded-t" style={{ height: `${(data.users / 4000) * 100}%` }} />
                      <div className="flex-1 bg-india-green/80 rounded-t" style={{ height: `${(data.applications / 8000) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-india-blue rounded" /><span className="text-sm text-gray-600 dark:text-gray-400">New Users</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-india-green rounded" /><span className="text-sm text-gray-600 dark:text-gray-400">Applications</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Verifications ({mockPendingUsers.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-india-blue dark:bg-gray-700 dark:text-white text-sm" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-india-blue/10 flex items-center justify-center">
                              <span className="text-india-blue font-semibold text-sm">{user.fullName[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{user.fullName}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.phone}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">{user.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.submittedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"><CheckCircle className="h-3 w-3" />Verify</button>
                            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors flex items-center gap-1"><XCircle className="h-3 w-3" />Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Google AI Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-india-blue" />
                  Google AI Data Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Automatically fetch government opportunities from Google Search using AI extraction
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleGoogleRefresh('scheme')} disabled={!!refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50">
                  {refreshing === 'scheme' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh Schemes
                </button>
                <button onClick={() => handleGoogleRefresh('exam')} disabled={!!refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
                  {refreshing === 'exam' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh Exams
                </button>
                <button onClick={() => handleGoogleRefresh('job')} disabled={!!refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50">
                  {refreshing === 'job' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh Jobs
                </button>
                <button onClick={() => handleGoogleRefresh('all')} disabled={!!refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-india-blue text-white text-sm font-medium rounded-lg hover:bg-india-blue/90 transition-colors disabled:opacity-50">
                  {refreshing === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh All
                </button>
              </div>
            </div>

            {refreshMessage && (
              <div className={`p-4 rounded-xl text-sm ${refreshMessage.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {refreshMessage}
              </div>
            )}

            {/* Cache Stats */}
            {cacheStats && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-india-blue" />
                  Cache Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{cacheStats.totalCached}</div>
                    <div className="text-xs text-gray-500">Total Cached Items</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{cacheStats.entries?.length || 0}</div>
                    <div className="text-xs text-gray-500">Active Cache Entries</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-india-blue">30 min</div>
                    <div className="text-xs text-gray-500">Cache TTL</div>
                  </div>
                </div>
                {cacheStats.entries && cacheStats.entries.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 text-gray-500">Cache Key</th>
                          <th className="text-right py-2 text-gray-500">Items</th>
                          <th className="text-right py-2 text-gray-500">Age (sec)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cacheStats.entries.map((entry: any, i: number) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                            <td className="py-2 font-mono text-xs text-gray-600 dark:text-gray-400">{entry.key}</td>
                            <td className="py-2 text-right text-gray-900 dark:text-white font-medium">{entry.count}</td>
                            <td className="py-2 text-right text-gray-500">{entry.age}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-india-saffron/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-india-saffron" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Government Schemes</h3>
                    <p className="text-xs text-gray-500">Google AI-curated welfare programs</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dataCounts.schemes}</div>
                <div className="text-sm text-gray-500 mb-4">Auto-fetched entries</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Agriculture</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Education</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Health</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Housing</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-india-blue/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-india-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Competitive Exams</h3>
                    <p className="text-xs text-gray-500">Google AI-curated exam schedules</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dataCounts.exams}</div>
                <div className="text-sm text-gray-500 mb-4">Auto-fetched entries</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">UPSC</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">SSC</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Banking</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Defence</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-india-green/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-india-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Government Jobs</h3>
                    <p className="text-xs text-gray-500">Google AI-curated job listings</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dataCounts.jobs}</div>
                <div className="text-sm text-gray-500 mb-4">Auto-fetched entries</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Permanent</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Contract</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Railway</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Defence</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-india-blue" />
                How Google AI Auto-Fetch Works
              </h3>
              <div className="space-y-3">
                {[
                  { num: '1', title: 'Google Search Simulation', desc: 'The system simulates Google searches for latest government schemes, exams, and jobs across official portals (india.gov.in, sarkariresult.com, etc.).' },
                  { num: '2', title: 'AI Data Extraction', desc: 'Advanced AI extracts structured data (title, organization, eligibility, deadline, etc.) from search results using realistic government templates.' },
                  { num: '3', title: '30-Minute Smart Cache', desc: 'Data is cached for 30 minutes to optimize performance. Manual refresh via admin panel invalidates cache immediately.' },
                  { num: '4', title: 'Real Database Integration', desc: 'When MongoDB is connected, data can be persisted. Without DB, AI generates data on-the-fly with no manual maintenance needed.' },
                  { num: '5', title: 'Production Ready for Real API', desc: 'Add GOOGLE_API_KEY and OPENAI_API_KEY environment variables to connect to real Google Custom Search API and GPT-3.5 for live data.' },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-india-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-india-blue font-bold">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{step.title}</p>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Management</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Full user management features will be available soon. You can currently manage verifications from the Verifications tab.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
