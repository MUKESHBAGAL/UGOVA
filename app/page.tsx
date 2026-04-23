import Link from 'next/link'
import { 
  Building2, GraduationCap, Briefcase, Search, ArrowRight,
  Shield, FileCheck, Bell, Users, TrendingUp, Award, Clock
} from 'lucide-react'

const stats = [
  { label: 'Active Schemes', value: '150+', icon: Building2, color: 'bg-india-saffron/10 text-india-saffron' },
  { label: 'Upcoming Exams', value: '80+', icon: GraduationCap, color: 'bg-india-blue/10 text-india-blue' },
  { label: 'Job Openings', value: '200+', icon: Briefcase, color: 'bg-india-green/10 text-india-green' },
  { label: 'Registered Users', value: '50K+', icon: Users, color: 'bg-purple-100 text-purple-600' },
]

const features = [
  {
    icon: Search,
    title: 'Discover Opportunities',
    description: 'Find government schemes, competitive exams, and job openings all in one place.',
    color: 'bg-india-blue/10 text-india-blue'
  },
  {
    icon: FileCheck,
    title: 'Easy Applications',
    description: 'Apply for multiple opportunities with a single profile. Track your applications in real-time.',
    color: 'bg-india-green/10 text-india-green'
  },
  {
    icon: Shield,
    title: 'Verified Profile',
    description: 'Get your documents verified once and use them for all applications securely.',
    color: 'bg-india-saffron/10 text-india-saffron'
  },
  {
    icon: Bell,
    title: 'Stay Updated',
    description: 'Get notifications for new opportunities, deadlines, and application status updates.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your application status, exam results, and verification progress easily.',
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    icon: Award,
    title: 'Eligibility Match',
    description: 'Smart eligibility checker helps you find opportunities that match your profile.',
    color: 'bg-pink-100 text-pink-600'
  }
]

const categories = [
  { name: 'Education', count: '35 schemes', icon: GraduationCap, href: '/schemes?category=education' },
  { name: 'Health', count: '28 schemes', icon: Shield, href: '/schemes?category=health' },
  { name: 'Employment', count: '42 schemes', icon: Briefcase, href: '/schemes?category=employment' },
  { name: 'Housing', count: '18 schemes', icon: Building2, href: '/schemes?category=housing' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-govt-bg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Govt Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Government of India Initiative
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Gateway to{' '}
              <span className="text-yellow-300">Government</span>{' '}
              Opportunities
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Discover schemes, apply for competitive exams, and find government jobs. 
              All verified, all official, all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-india-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/schemes"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Browse Opportunities
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" className="dark:fill-gray-900"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-6 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse through different categories of government opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/schemes" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-india-saffron dark:hover:border-india-saffron transition-all card-hover">
                <div className="w-14 h-14 rounded-xl bg-india-saffron/10 flex items-center justify-center mb-4 group-hover:bg-india-saffron/20">
                  <Building2 className="h-7 w-7 text-india-saffron" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Government Schemes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Explore welfare schemes for education, health, housing, and more.
                </p>
                <span className="text-india-saffron font-medium text-sm flex items-center gap-1">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
            
            <Link href="/exams" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-india-blue dark:hover:border-india-blue transition-all card-hover">
                <div className="w-14 h-14 rounded-xl bg-india-blue/10 flex items-center justify-center mb-4 group-hover:bg-india-blue/20">
                  <GraduationCap className="h-7 w-7 text-india-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Competitive Exams</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  UPSC, SSC, Banking, Defence, and all other competitive exams.
                </p>
                <span className="text-india-blue font-medium text-sm flex items-center gap-1">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
            
            <Link href="/jobs" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-india-green dark:hover:border-india-green transition-all card-hover">
                <div className="w-14 h-14 rounded-xl bg-india-green/10 flex items-center justify-center mb-4 group-hover:bg-india-green/20">
                  <Briefcase className="h-7 w-7 text-india-green" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Government Jobs</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Latest job openings across central and state government departments.
                </p>
                <span className="text-india-green font-medium text-sm flex items-center gap-1">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 section-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why UGOVA?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We make it easy to discover and apply for government opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Popular Categories</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse schemes by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <Link key={index} href={cat.href} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-india-blue transition-all card-hover text-center">
                  <div className="w-14 h-14 rounded-full bg-india-blue/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-india-blue/20">
                    <cat.icon className="h-6 w-6 text-india-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-india-blue to-india-navy rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Create your profile, verify your documents, and start applying for government opportunities today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-white text-india-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Already Registered? Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
