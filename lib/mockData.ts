// Re-export AI data generator for backward compatibility
// This file now delegates to the AI-powered data generator
import { generateSchemes, generateExams, generateJobs } from './aiDataGenerator'

// Export async versions for direct import
export { generateSchemes, generateExams, generateJobs }

// Legacy synchronous exports - these now trigger async generation when called
// Note: In actual usage, use the async functions above or the API routes
let cachedMockSchemes: any[] = []
let cachedMockExams: any[] = []
let cachedMockJobs: any[] = []
let cacheInitialized = false

async function ensureCache() {
  if (!cacheInitialized) {
    [cachedMockSchemes, cachedMockExams, cachedMockJobs] = await Promise.all([
      generateSchemes(15),
      generateExams(12),
      generateJobs(10)
    ])
    cacheInitialized = true
  }
}

// Synchronous fallbacks (return cached data after first async call)
export const mockSchemes = cachedMockSchemes
export const mockExams = cachedMockExams
export const mockJobs = cachedMockJobs

// Pre-populate cache on module load
ensureCache().catch(console.error)
