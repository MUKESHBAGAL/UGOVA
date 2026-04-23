import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { generateSchemes } from '@/lib/aiDataGenerator'

// Cache for AI-generated data
let cachedSchemes: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getSchemesData() {
  const now = Date.now()
  if (cachedSchemes && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedSchemes
  }

  // Try DB first
  const conn = await connectDB()
  if (conn) {
    try {
      const Scheme = (await import('@/models/Scheme')).default
      const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 })
      if (schemes.length > 0) {
        cachedSchemes = schemes
        lastFetchTime = now
        return schemes
      }
    } catch (dbError) {
      console.warn('DB fetch failed for schemes, using AI fallback:', dbError)
    }
  }

  // Fallback to AI-generated data
  const schemes = await generateSchemes(15)
  cachedSchemes = schemes
  lastFetchTime = now
  return schemes
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    const schemes = await getSchemesData()

    let filtered = [...schemes]
    if (category && category !== 'all') {
      filtered = filtered.filter((s: any) => s.category === category)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter((s: any) => s.state === state || s.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((s: any) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.ministry?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, schemes: filtered })
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
      const Scheme = (await import('@/models/Scheme')).default
      const scheme = await Scheme.create(body)
      return NextResponse.json({ success: true, scheme }, { status: 201 })
    }

    return NextResponse.json({ success: true, scheme: body }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
