'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Shield, Clock, FileCheck, Building2, GraduationCap, 
  Briefcase, TrendingUp, AlertCircle, CheckCircle, XCircle,
  ArrowRight, Award, Calendar
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-india-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    redirect('/login')
  }

  const verificationStatus = session.user.verificationStatus || 'pending'
  
  const statusConfig = {
    pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock, label: 'Pending Verification' },
    verified: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Verified' },
    rejected: { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: 'Rejected' }
  }

  const statusInfo = statusConfig[verificationStatus as keyof typeof statusConfig]

  const quickLinks = [
    { href: '/schemes', label: 'Browse Schemes', icon: Building2, color: 'bg-india-saffron/10 text-india-saffron' },
    { href: '/exams', label: 'Find Exams', icon: GraduationCap, color: 'bg-india-blue/10 text-india-blue' },
    { href: '/jobs', label: 'View Jobs', icon: Briefcase, color: 'bg-india-green/10 text-india-green' },
    { href: '/profile', label: 'My Profile', icon: User, color: 'bg-purple-100 text-purple-600' },
  ]

  const recentActivity = [
    { title: 'Profile Created', date: '2 days ago', icon: User, color: 'bg-india-blue/10 text-india-blue' },
    { title: 'Document Upload Pending', date: '2 days ago', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Verification in Progress', date: '1 day ago', icon: Clock, color: 'bg-india-saffron/10 text-india-saffron' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Welcome Banner */}
      <div className="hero-govt-bg text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {session.user.name}!</h1>
              <p className="text-white/80">Here's your dashboard overview</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.color.split(' ')[1]}`}>
                <statusInfo.icon className={`h-6 w-6 ${statusInfo.color.split(' ')[0]}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Verification Status</h3>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                  <statusInfo.icon className="h-3 w-3" />
                  {statusInfo.label}
                </span>
              </div>
            </div>
            
            {verificationStatus === 'pending' && (
              <Link 
                href="/profile"
                className="px-4 py-2 bg-india-blue text-white rounded-lg text-sm font-medium hover:bg-india-blue/90 transition-colors inline-flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Complete Verification
              </Link>
            )}
          </div>
          
          {verificationStatus === 'pending' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Please upload your documents to complete your verification. Verified profiles have higher chances of approval.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-india-saffron/10 flex items-center justify-center mb-3">
              <Building2 className="h-5 w-5 text-india-saffron" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Scheme Applications</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-india-blue/10 flex items-center justify-center mb-3">
              <GraduationCap className="h-5 w-5 text-india-blue" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Exam Applications</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-india-green/10 flex items-center justify-center mb-3">
              <Briefcase className="h-5 w-5 text-india-green" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Job Applications</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Approved</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-india-blue transition-all card-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{link.label}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-india-blue transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
