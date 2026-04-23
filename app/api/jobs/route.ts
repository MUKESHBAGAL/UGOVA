import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { withDB } from '@/lib/dbGuard'
import { fetchFromGoogleAI } from '@/lib/googleAIService'

export const dynamic = 'force-dynamic'

// ─── GET /api/jobs ──────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobType = searchParams.get('jobType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    // Try DB first, fallback to Google AI auto-fetch
    const jobs = await withDB(
      async () => {
        const Job = (await import('@/models/Job')).default
        const dbJobs = await Job.find({ isActive: true }).sort({ applicationEnd: 1 }).lean()
        if (dbJobs.length > 0) {
          console.log(`✅ [jobs/route] Served ${dbJobs.length} from DB`)
          return dbJobs
        }
        throw new Error('No DB records')
      },
      async () => {
        console.log('🤖 [jobs/route] DB unavailable → fetching from Google AI...')
        const aiJobs = await fetchFromGoogleAI('job', 12)
        return aiJobs
      }
    )

    // Filter
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
        (j.title?.toLowerCase() || '').includes(q) ||
        (j.description?.toLowerCase() || '').includes(q) ||
        (j.organization?.toLowerCase() || '').includes(q) ||
        (j.department?.toLowerCase() || '').includes(q)
      )
    }

    return NextResponse.json({ success: true, jobs: filtered, source: 'ai-auto-fetch' })
  } catch (error: any) {
    console.error('❌ [jobs/route] GET error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// ─── POST /api/jobs ─────────────────────────────────────────────────

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
