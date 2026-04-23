import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import Scheme from '@/models/Scheme'
import { generateSchemes } from '@/lib/aiDataGenerator'

// Cache for AI-generated data (refreshes every request in dev, can be memoized in prod)
let cachedSchemes: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

async function getSchemesData() {
  const now = Date.now()
  if (cachedSchemes && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedSchemes
  }

  try {
    await connectDB()

    if (isDBMockMode()) {
      // Generate fresh AI data
      const schemes = await generateSchemes(15)
      cachedSchemes = schemes
      lastFetchTime = now
      return schemes
    }

    // Try database
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 })
    if (schemes.length === 0) {
      // Seed with AI data if empty
      const aiSchemes = await generateSchemes(15)
      // Note: In real DB mode, you'd insert these. For now return them directly
      cachedSchemes = aiSchemes
      lastFetchTime = now
      return aiSchemes
    }
    return schemes
  } catch (error) {
    console.warn('DB error, using AI-generated fallback:', error)
    const schemes = await generateSchemes(15)
    cachedSchemes = schemes
    lastFetchTime = now
    return schemes
  }
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
      filtered = filtered.filter(s => s.category === category)
    }
    if (state && state !== 'all') {
      filtered = filtered.filter(s => s.state === state || s.state === 'All India')
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(s =>
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
    await connectDB()
    if (isDBMockMode()) {
      const body = await req.json()
      return NextResponse.json({ success: true, scheme: body }, { status: 201 })
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
