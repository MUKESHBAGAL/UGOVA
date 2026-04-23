'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  ArrowLeft, CheckCircle, Building2, GraduationCap, Briefcase,
  FileCheck, AlertCircle, Loader2, Send
} from 'lucide-react'

function ApplyContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'scheme'
  const id = searchParams.get('id') || ''
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const typeConfig = {
    scheme: { 
      icon: Building2, 
      color: 'text-india-saffron', 
      bgColor: 'bg-india-saffron/10',
      label: 'Government Scheme',
      title: 'Apply for Government Scheme'
    },
    exam: { 
      icon: GraduationCap, 
      color: 'text-india-blue', 
      bgColor: 'bg-india-blue/10',
      label: 'Competitive Exam',
      title: 'Apply for Competitive Exam'
    },
    job: { 
      icon: Briefcase, 
      color: 'text-india-green', 
      bgColor: 'bg-india-green/10',
      label: 'Government Job',
      title: 'Apply for Government Job'
    }
  }

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.scheme

  const handleSubmit = async () => {
    if (!agreed) return
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your application has been successfully submitted. You can track its status from your dashboard.
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Application ID:</span> UGOVA-{Date.now().toString().slice(-8)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium">Status:</span>{' '}
                <span className="text-yellow-600">Under Review</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard"
                className="px-6 py-3 bg-india-blue text-white font-semibold rounded-lg hover:bg-india-blue/90 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link 
                href={`/${type}s`}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse More {type === 'scheme' ? 'Schemes' : type === 'exam' ? 'Exams' : 'Jobs'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href={`/${type}s`} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to {type === 'scheme' ? 'Schemes' : type === 'exam' ? 'Exams' : 'Jobs'}
          </Link>
          
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <config.icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Complete the application process</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!session ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-india-saffron mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please login or create an account to apply for this {config.label.toLowerCase()}.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/login"
                className="px-6 py-3 bg-india-blue text-white font-semibold rounded-lg hover:bg-india-blue/90 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? 'bg-india-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Review Details</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-india-blue' : 'bg-gray-200'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? 'bg-india-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Confirm</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-india-blue' : 'bg-gray-200'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 3 ? 'bg-india-blue text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Submit</span>
              </div>
            </div>

            {/* Step 1: Review Details */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Your Profile</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{session.user.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{session.user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">Verification Status: Pending</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                        Your profile is not yet verified. You can still apply, but verification is recommended for faster processing.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-india-blue text-white font-semibold rounded-lg hover:bg-india-blue/90 transition-colors"
                >
                  Continue to Confirmation
                </button>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Application</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FileCheck className="h-5 w-5 text-india-blue mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Application Details</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        You are applying for: <span className="font-medium">{config.label}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Application ID will be generated upon submission.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-india-blue focus:ring-india-blue"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">I confirm that:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        <li>All information provided is true and accurate</li>
                        <li>I meet the eligibility criteria for this opportunity</li>
                        <li>I understand that false information may lead to rejection</li>
                      </ul>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!agreed}
                    className="flex-1 py-3 bg-india-blue text-white font-semibold rounded-lg hover:bg-india-blue/90 transition-colors disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Submit */}
            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-india-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-india-blue" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Submit?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Once submitted, your application will be reviewed by the concerned authorities. 
                  You will be notified of any updates.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-india-green text-white font-semibold rounded-lg hover:bg-india-green/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-india-blue" />
      </div>
    }>
      <ApplyContent />
    </Suspense>
  )
}
