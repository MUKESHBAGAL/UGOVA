import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import Job from '@/models/Job'
import { generateJobs } from '@/lib/aiDataGenerator'

let cachedJobs: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getJobsData() {
  const now = Date.now()
  if (cachedJobs && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedJobs
  }

  try {
    await connectDB()

    if (isDBMockMode()) {
      const jobs = await generateJobs(10)
      cachedJobs = jobs
      lastFetchTime = now
      return jobs
    }

    const jobs = await Job.find({ isActive: true }).sort({ applicationEnd: 1 })
    if (jobs.length === 0) {
      const aiJobs = await generateJobs(10)
      cachedJobs = aiJobs
      lastFetchTime = now
      return aiJobs
    }
    return jobs
  } catch (error) {
    console.warn('DB error, using AI-generated fallback:', error)
    const jobs = await generateJobs(10)
    cachedJobs = jobs
    lastFetchTime = now
    return jobs
  }
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
      filtered = filtered.filter(j => j.jobType === jobType)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter(j => j.state === state || j.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(j =>
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
    await connectDB()
    if (isDBMockMode()) {
      const body = await req.json()
      return NextResponse.json({ success: true, job: body }, { status: 201 })
    }
    const body = await req.json()
    const job = await Job.create(body)
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
