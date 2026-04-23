import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { generateJobs } from '@/lib/aiDataGenerator'

let cachedJobs: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getJobsData() {
  const now = Date.now()
  if (cachedJobs && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedJobs
  }

  const conn = await connectDB()
  if (conn) {
    try {
      const Job = (await import('@/models/Job')).default
      const jobs = await Job.find({ isActive: true }).sort({ applicationEnd: 1 })
      if (jobs.length > 0) {
        cachedJobs = jobs
        lastFetchTime = now
        return jobs
      }
    } catch (dbError) {
      console.warn('DB fetch failed for jobs, using AI fallback:', dbError)
    }
  }

  const jobs = await generateJobs(10)
  cachedJobs = jobs
  lastFetchTime = now
  return jobs
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobType = searchParams.get('jobType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    const jobs = await getJobsData()

    let filtered = [...jobs]
    if (jobType && jobType !== 'all') {
      filtered = filtered.filter((j: any) => j.jobType === jobType)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter((j: any) => j.state === state || j.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((j: any) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.organization.toLowerCase().includes(q) ||
        j.department?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, jobs: filtered })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const conn = await connectDB()

    if (conn) {
      const Job = (await import('@/models/Job')).default
      const job = await Job.create(body)
      return NextResponse.json({ success: true, job }, { status: 201 })
    }

    return NextResponse.json({ success: true, job: body }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
