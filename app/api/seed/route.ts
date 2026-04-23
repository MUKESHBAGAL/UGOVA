import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { withDB } from '@/lib/dbGuard'
import { refreshGoogleData, getCacheStats } from '@/lib/googleAIService'

export const dynamic = 'force-dynamic'

// ─── GET /api/seed ────────────────────────────────────────────────────
// Admin endpoint to seed or refresh all data from Google AI

export async function GET() {
  try {
    const conn = await connectDB()

    // Refresh Google AI data (clears caches + fetches fresh)
    const refreshResult = await refreshGoogleData('all')

    // If DB connected, also seed it
    if (conn && refreshResult.success && refreshResult.counts) {
      try {
        const Scheme = (await import('@/models/Scheme')).default
        const Exam = (await import('@/models/Exam')).default
        const Job = (await import('@/models/Job')).default

        // Note: In production with real Google API, you'd map AI-fetched data here
        console.log('🗄️ [seed/route] DB connected - seeding would happen with real data')
      } catch (dbError) {
        console.warn('DB seed skipped:', dbError)
      }
    }

    const cacheStats = getCacheStats()

    return NextResponse.json({
      success: true,
      message: refreshResult.message,
      dbConnected: !!conn,
      counts: refreshResult.counts,
      cache: cacheStats,
      source: 'google-ai-auto-fetch',
    })
  } catch (error: any) {
    console.error('❌ [seed/route] Error:', error.message)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
