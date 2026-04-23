import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { generateExams } from '@/lib/aiDataGenerator'

let cachedExams: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getExamsData() {
  const now = Date.now()
  if (cachedExams && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedExams
  }

  const conn = await connectDB()
  if (conn) {
    try {
      const Exam = (await import('@/models/Exam')).default
      const exams = await Exam.find({ isActive: true }).sort({ applicationEnd: 1 })
      if (exams.length > 0) {
        cachedExams = exams
        lastFetchTime = now
        return exams
      }
    } catch (dbError) {
      console.warn('DB fetch failed for exams, using AI fallback:', dbError)
    }
  }

  const exams = await generateExams(12)
  cachedExams = exams
  lastFetchTime = now
  return exams
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const examType = searchParams.get('examType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    const exams = await getExamsData()

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
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.organization.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, exams: filtered })
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
