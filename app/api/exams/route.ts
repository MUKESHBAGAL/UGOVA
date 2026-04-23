import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { withDB } from '@/lib/dbGuard'
import { fetchFromGoogleAI } from '@/lib/googleAIService'

export const dynamic = 'force-dynamic'

// ─── GET /api/exams ─────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const examType = searchParams.get('examType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    // Try DB first, fallback to Google AI auto-fetch
    const exams = await withDB(
      async () => {
        const Exam = (await import('@/models/Exam')).default
        const dbExams = await Exam.find({ isActive: true }).sort({ applicationEnd: 1 }).lean()
        if (dbExams.length > 0) {
          console.log(`✅ [exams/route] Served ${dbExams.length} from DB`)
          return dbExams
        }
        throw new Error('No DB records')
      },
      async () => {
        console.log('🤖 [exams/route] DB unavailable → fetching from Google AI...')
        const aiExams = await fetchFromGoogleAI('exam', 12)
        return aiExams
      }
    )

    // Filter
    let filtered = [...exams]
    if (examType && examType !== 'all') {
      filtered = filtered.filter((e: any) => e.examType === examType)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter((e: any) => e.state === state || e.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((e: any) =>
        (e.title?.toLowerCase() || '').includes(q) ||
        (e.description?.toLowerCase() || '').includes(q) ||
        (e.organization?.toLowerCase() || '').includes(q)
      )
    }

    return NextResponse.json({ success: true, exams: filtered, source: 'ai-auto-fetch' })
  } catch (error: any) {
    console.error('❌ [exams/route] GET error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// ─── POST /api/exams ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const conn = await connectDB()

    if (conn) {
      const Exam = (await import('@/models/Exam')).default
      const exam = await Exam.create(body)
      return NextResponse.json({ success: true, exam }, { status: 201 })
    }

    return NextResponse.json({ success: true, exam: body }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
