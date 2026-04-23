import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Scheme from '@/models/Scheme'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const state = searchParams.get('state')
    const search = searchParams.get('search')
    
    let query: any = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
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
    const body = await req.json()
    
    const scheme = await Scheme.create(body)
    
    return NextResponse.json(
      { success: true, scheme },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
