import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import Exam from '@/models/Exam'
import { generateExams } from '@/lib/aiDataGenerator'

let cachedExams: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getExamsData() {
  const now = Date.now()
  if (cachedExams && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedExams
  }

  try {
    await connectDB()

    if (isDBMockMode()) {
      const exams = await generateExams(12)
      cachedExams = exams
      lastFetchTime = now
      return exams
    }

    const exams = await Exam.find({ isActive: true }).sort({ applicationEnd: 1 })
    if (exams.length === 0) {
      const aiExams = await generateExams(12)
      cachedExams = aiExams
      lastFetchTime = now
      return aiExams
    }
    return exams
  } catch (error) {
    console.warn('DB error, using AI-generated fallback:', error)
    const exams = await generateExams(12)
    cachedExams = exams
    lastFetchTime = now
    return exams
  }
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
      filtered = filtered.filter(e => e.examType === examType)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter(e => e.state === state || e.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(e =>
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
    await connectDB()
    if (isDBMockMode()) {
      const body = await req.json()
      return NextResponse.json({ success: true, exam: body }, { status: 201 })
    }
    const body = await req.json()
    const exam = await Exam.create(body)
    return NextResponse.json({ success: true, exam }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
