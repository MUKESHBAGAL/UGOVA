import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import Scheme from '@/models/Scheme'
import { mockSchemes } from '@/lib/mockData'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    await connectDB()

    if (isDBMockMode()) {
      let schemes = [...mockSchemes]
      if (category && category !== 'all') {
        schemes = schemes.filter(s => s.category === category)
      }
      if (state && state !== 'all') {
        schemes = schemes.filter(s => s.state === state)
      }
      if (search) {
        const q = search.toLowerCase()
        schemes = schemes.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.organization.toLowerCase().includes(q)
        )
      }
      return NextResponse.json({ success: true, schemes })
    }

    let query: any = { isActive: true }
    if (category && category !== 'all') query.category = category
    if (state && state !== 'all') query.state = state
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ]
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, schemes })
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
      return NextResponse.json({ success: true, scheme: mockSchemes[0] }, { status: 201 })
    }
    const body = await req.json()
    const scheme = await Scheme.create(body)
    return NextResponse.json({ success: true, scheme }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
