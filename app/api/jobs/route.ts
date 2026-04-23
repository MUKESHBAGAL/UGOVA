import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import Job from '@/models/Job'
import { mockJobs } from '@/lib/mockData'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobType = searchParams.get('jobType')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    await connectDB()

    if (isDBMockMode()) {
      let jobs = [...mockJobs]
      if (jobType && jobType !== 'all') {
        jobs = jobs.filter(j => j.jobType === jobType)
      }
      if (state && state !== 'all') {
        jobs = jobs.filter(j => j.state === state)
      }
      if (search) {
        const q = search.toLowerCase()
        jobs = jobs.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.organization.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q)
        )
      }
      return NextResponse.json({ success: true, jobs })
    }

    let query: any = { isActive: true }
    if (jobType && jobType !== 'all') query.jobType = jobType
    if (state && state !== 'all') query.state = state
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    }

    const jobs = await Job.find(query).sort({ applicationEnd: 1 })
    return NextResponse.json({ success: true, jobs })
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
      return NextResponse.json({ success: true, job: mockJobs[0] }, { status: 201 })
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
