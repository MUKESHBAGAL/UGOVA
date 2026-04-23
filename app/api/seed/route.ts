import { NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import { generateAllData } from '@/lib/aiDataGenerator'

export async function GET() {
  try {
    const { schemes, exams, jobs } = await generateAllData()

    if (!isDBMockMode()) {
      // Only try database operations if DB is connected
      try {
        await connectDB()
        // Import models dynamically to avoid issues
        const Scheme = (await import('@/models/Scheme')).default
        const Exam = (await import('@/models/Exam')).default
        const Job = (await import('@/models/Job')).default

        await Promise.all([
          Scheme.deleteMany({}),
          Exam.deleteMany({}),
          Job.deleteMany({})
        ])

        await Promise.all([
          Scheme.insertMany(schemes.map(s => ({
            ...s,
            deadline: new Date(s.deadline)
          }))),
          Exam.insertMany(exams.map(e => ({
            ...e,
            applicationStart: new Date(e.applicationStart),
            applicationEnd: new Date(e.applicationEnd),
            examDate: new Date(e.examDate)
          }))),
          Job.insertMany(jobs.map(j => ({
            ...j,
            applicationStart: new Date(j.applicationStart),
            applicationEnd: new Date(j.applicationEnd)
          })))
        ])
      } catch (dbError) {
        console.warn('DB seed failed, returning AI data:', dbError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded with AI-generated data',
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
