import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { generateAllData } from '@/lib/aiDataGenerator'

export async function GET() {
  try {
    const { schemes, exams, jobs } = await generateAllData()

    // Try to connect to DB first
    const conn = await connectDB()

    if (conn) {
      // Only try database operations if DB connected successfully
      try {
        const Scheme = (await import('@/models/Scheme')).default
        const Exam = (await import('@/models/Exam')).default
        const Job = (await import('@/models/Job')).default

        await Promise.all([
          Scheme.deleteMany({}),
          Exam.deleteMany({}),
          Job.deleteMany({})
        ])

        await Promise.all([
          Scheme.insertMany(schemes.map((s: any) => ({
            ...s,
            deadline: new Date(s.deadline)
          }))),
          Exam.insertMany(exams.map((e: any) => ({
            ...e,
            applicationStart: new Date(e.applicationStart),
            applicationEnd: new Date(e.applicationEnd),
            examDate: new Date(e.examDate)
          }))),
          Job.insertMany(jobs.map((j: any) => ({
            ...j,
            applicationStart: new Date(j.applicationStart),
            applicationEnd: new Date(j.applicationEnd)
          })))
        ])
      } catch (dbError) {
        console.warn('DB seed failed, returning AI data:', dbError)
      }
    } else {
      console.warn('No DB connection, returning AI-generated data only')
    }

    return NextResponse.json({ 
      success: true, 
      message: conn ? 'Database seeded with AI-generated data' : 'AI-generated data (DB not connected)',
      counts: {
        schemes: schemes.length,
        exams: exams.length,
        jobs: jobs.length
      },
      data: { schemes, exams, jobs }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
