import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Exam from '@/models/Exam'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const examType = searchParams.get('examType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')
    
    let query: any = { isActive: true }
    
    if (examType && examType !== 'all') {
      query.examType = examType
    }
    
    if (state && state !== 'all') {
      query.state = state
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ]
    }
    
    const exams = await Exam.find(query).sort({ applicationEnd: 1 })
    
    return NextResponse.json({ success: true, exams })
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
    const body = await req.json()
    
    const exam = await Exam.create(body)
    
    return NextResponse.json(
      { success: true, exam },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
