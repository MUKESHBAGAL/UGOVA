import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { withDB } from '@/lib/dbGuard'
import { fetchFromGoogleAI } from '@/lib/googleAIService'

export const dynamic = 'force-dynamic'

// ─── GET /api/schemes ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const state = searchParams.get('state')
    const search = searchParams.get('search')

    // Try DB first, fallback to Google AI auto-fetch
    const schemes = await withDB(
      async () => {
        const Scheme = (await import('@/models/Scheme')).default
        const dbSchemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 }).lean()
        if (dbSchemes.length > 0) {
          console.log(`✅ [schemes/route] Served ${dbSchemes.length} from DB`)
          return dbSchemes
        }
        throw new Error('No DB records')
      },
      async () => {
        console.log('🤖 [schemes/route] DB unavailable → fetching from Google AI...')
        const aiSchemes = await fetchFromGoogleAI('scheme', 12)
        return aiSchemes
      }
    )

    // Filter
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
        (s.title?.toLowerCase() || '').includes(q) ||
        (s.description?.toLowerCase() || '').includes(q) ||
        (s.organization?.toLowerCase() || '').includes(q) ||
        (s.ministry?.toLowerCase() || '').includes(q)
      )
    }

    return NextResponse.json({ success: true, schemes: filtered, source: 'ai-auto-fetch' })
  } catch (error: any) {
    console.error('❌ [schemes/route] GET error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// ─── POST /api/schemes ──────────────────────────────────────────────

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
