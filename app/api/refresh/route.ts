import { NextRequest, NextResponse } from 'next/server'
import { refreshGoogleData } from '@/lib/googleAIService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/refresh
 * Admin endpoint to manually refresh AI-curated data from Google
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const category = body.category || 'all'

    console.log(`🔄 [refresh/route] Manual refresh requested for: ${category}`)

    const result = await refreshGoogleData(category as 'scheme' | 'exam' | 'job' | 'all')

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ [refresh/route] Error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/refresh
 * Returns cache statistics
 */
export async function GET() {
  try {
    const { getCacheStats } = await import('@/lib/googleAIService')
    const stats = getCacheStats()

    return NextResponse.json({
      success: true,
      message: 'Cache statistics',
      cache: stats,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
