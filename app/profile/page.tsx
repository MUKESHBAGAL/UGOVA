'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { 
  User, Mail, Phone, Calendar, GraduationCap, MapPin, 
  Shield, Upload, CheckCircle, XCircle, Clock, FileCheck,
  Award, Building2, Briefcase, Edit3, Save, Loader2
} from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-india-blue" />
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-india-blue to-india-navy relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-india-saffron to-india-green flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{session.user.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400">{session.user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-india-blue text-white rounded-lg text-sm font-medium hover:bg-india-blue/90 transition-colors flex items-center gap-2"
              >
                {editing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {editing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                <statusInfo.icon className="h-3 w-3" />
                {statusInfo.label}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-india-blue/10 text-india-blue border border-india-blue/20">
                <Shield className="h-3 w-3" />
                {session.user.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-india-blue" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{session.user.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{session.user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Not provided</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Not provided</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Gender</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Not provided</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Category</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">Not provided</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-india-green" />
                Education Details
              </h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <GraduationCap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No education details added yet</p>
                <button className="mt-2 text-india-blue text-sm font-medium hover:underline">
                  Add Education
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-india-saffron" />
                Address Details
              </h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No address added yet</p>
                <button className="mt-2 text-india-blue text-sm font-medium hover:underline">
                  Add Address
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-india-blue" />
                Verification Status
              </h2>
              
              <div className={`p-4 rounded-lg border ${statusInfo.color} mb-4`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${statusInfo.color.split(' ')[1]} flex items-center justify-center`}>
                    <statusInfo.icon className={`h-5 w-5 ${statusInfo.color.split(' ')[0]}`} />
                  </div>
                  <div>
                    <p className="font-medium">{statusInfo.label}</p>
                    <p className="text-sm opacity-80">
                      {verificationStatus === 'pending' 
                        ? 'Upload documents for verification'
                        : verificationStatus === 'verified'
                        ? 'Your profile is verified'
                        : 'Please contact support'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {verificationStatus === 'pending' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Required Documents:</p>
                  {[
                    { name: 'Aadhaar Card', status: 'pending' },
                    { name: 'PAN Card', status: 'pending' },
                    { name: 'Education Certificate', status: 'pending' },
                    { name: 'Passport Photo', status: 'pending' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                      <label className="cursor-pointer px-3 py-1.5 bg-india-blue text-white text-xs rounded-lg hover:bg-india-blue/90 transition-colors flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        Upload
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Application Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-india-saffron" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Schemes</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-india-blue" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Exams</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-india-green" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Jobs</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
