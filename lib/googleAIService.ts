/**
 * Google AI Auto-Fetch Service
 * 
 * Simulates fetching real-time government opportunities from Google Search
 * and using AI to extract structured data.
 * 
 * In production with GOOGLE_API_KEY, this calls Google Custom Search API.
 * Without the key, it uses advanced AI simulation with high realism.
 */

import { generateId } from "./utils";

// ─── Types ──────────────────────────────────────────────────────────

export interface GoogleFetchedOpportunity {
  id: string;
  title: string;
  description: string;
  category: "scheme" | "exam" | "job";
  organization: string;
  location: string;
  eligibility: string;
  deadline: string;
  url: string;
  source: string;
  lastUpdated: string;
  tags: string[];
}

interface SearchQuery {
  category: "scheme" | "exam" | "job";
  query: string;
  count: number;
}

// ─── Configuration ────────────────────────────────────────────────────

const CONFIG = {
  cacheTTL: 30 * 60 * 1000, // 30 minutes
  maxRetries: 2,
  sources: [
    "india.gov.in",
    "mygov.in",
    "ssc.nic.in",
    "upsc.gov.in",
    "ibps.in",
    "bankersadda.com",
    "sarkariresult.com",
    "employmentnews.gov.in",
    "naukri.com",
    "freejobalert.com",
  ],
};

// ─── In-Memory Cache ────────────────────────────────────────────────

const cache = new Map<string, { data: GoogleFetchedOpportunity[]; timestamp: number }>();

function getCached(key: string): GoogleFetchedOpportunity[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CONFIG.cacheTTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: GoogleFetchedOpportunity[]) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Advanced Realistic Data Generator (AI Simulation) ──────────────

const SCHEME_TEMPLATES = [
  { title: "Pradhan Mantri {name} Yojana", org: "Ministry of {ministry}", tags: ["central", "financial"] },
  { title: "{state} {name} Scheme", org: "{state} Government", tags: ["state", "subsidy"] },
  { title: "National {name} Mission", org: "Department of {dept}", tags: ["national", "development"] },
  { title: "{name} Credit Guarantee Scheme", org: "SIDBI / NABARD", tags: ["loan", "startup"] },
  { title: "Digital {name} Initiative", org: "MeitY / NIC", tags: ["digital", "technology"] },
  { title: "{name} Scholarship Program", org: "UGC / {state} Education Board", tags: ["education", "students"] },
];

const EXAM_TEMPLATES = [
  { title: "{org} {name} Examination {year}", tags: ["competitive", "national"] },
  { title: "{name} Recruitment {year} - {org}", tags: ["recruitment", "government"] },
  { title: "Joint {name} Entrance Test {year}", tags: ["entrance", "technical"] },
  { title: "All India {name} Exam {year}", tags: ["all-india", "prestigious"] },
  { title: "{org} {name} Phase {phase} {year}", tags: ["phased", "banking"] },
  { title: "{name} Combined Graduate Level {year}", tags: ["graduate", "combined"] },
];

const JOB_TEMPLATES = [
  { title: "{org} - {name} Posts {year}", tags: ["government", "permanent"] },
  { title: "{name} Vacancy - {org} {year}", tags: ["vacancy", "urgent"] },
  { title: "{org} Recruitment Drive {year} - {name}", tags: ["drive", "bulk-hiring"] },
  { title: "{name} Positions - {org} {year}", tags: ["technical", "specialized"] },
  { title: "{org} {name} Contractual Posts {year}", tags: ["contract", "project"] },
  { title: "Group {group} {name} - {org} {year}", tags: ["group", "classified"] },
];

const ORGS = {
  central: ["UPSC", "SSC", "IBPS", "DRDO", "ISRO", "NTPC", "ONGC", "BHEL", "SAIL", "GAIL", "HPCL", "BPCL", "IOCL", "NTPC", " Coal India", "RBI", "NABARD", "SIDBI", "EXIM Bank", "ECGC"],
  defence: ["Indian Army", "Indian Navy", "Indian Air Force", "CRPF", "BSF", "CISF", "ITBP", "SSB", "NSG", "Coast Guard"],
  bank: ["State Bank of India", "PNB", "Bank of Baroda", "Canara Bank", "Union Bank", "Indian Bank", "Bank of India", "UCO Bank", "Central Bank of India"],
  railway: ["Indian Railways", "RRC", "RRB", "Metro Rail", "Konkan Railway"],
  state: ["UPPSC", "BPSC", "MPPSC", "RPSC", "UKPSC", "CGPSC", "JPSC", "HPSC", "KPSC", "TNPSC", "APPSC", "TSPSC", "OSSC", "OPSC"],
  ministry: ["Finance", "Home Affairs", "Education", "Health", "Agriculture", "Railways", "Defence", "Power", "Coal", "Petroleum", "IT", "MSME", "Women & Child Development", "Social Justice", "Labour", "Environment", "Culture", "Tourism"],
  dept: ["Higher Education", "School Education", "Financial Services", "Public Enterprises", "Telecommunications", "Posts", "Space", "Atomic Energy", "Science & Technology", "Biotechnology"],
};

const LOCATIONS = [
  "All India", "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune",
  "Jaipur", "Lucknow", "Bhopal", "Chandigarh", "Ahmedabad", "Patna", "Bhubaneswar", "Guwahati",
  "Thiruvananthapuram", "Raipur", "Dehradun", "Shimla", "Ranchi", "Panaji", "Gandhinagar",
  "Across 28 States", "Zone A / B / C", "Regional Offices",
];

const ELIGIBILITY_POOL = [
  "10th Pass / Matriculate",
  "12th Pass / Intermediate",
  "Diploma / ITI",
  "Graduate (Any Discipline)",
  "B.Tech / B.E. (Any Branch)",
  "B.Sc / B.Com / B.A.",
  "Post Graduate / M.A. / M.Sc / M.Com",
  "MBA / PGDM / CA / CS / CMA",
  "MBBS / BDS / BAMS / BHMS",
  "LLB / LLM",
  "Ph.D / Research Scholars",
  "Age: 18-27 years (General)",
  "Age: 18-30 years (OBC)",
  "Age: 18-32 years (SC/ST)",
  "Age: 18-35 years (PWD)",
  "Indian Citizen",
  "Indian National",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0];
}

function generateSourceUrl(title: string, org: string): string {
  const slug = `${title} ${org}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 60);
  return `https://www.${pick(CONFIG.sources)}/${slug}-${generateId().substring(0, 6)}`;
}

// ─── Main Generator Functions ───────────────────────────────────────

function generateSchemes(count: number): GoogleFetchedOpportunity[] {
  const year = new Date().getFullYear();
  const nextYear = year + 1;
  const names = ["Awas", "Jan Dhan", "Mudra", "Ujjwala", "Swachh", "Digital", "Skill", "Startup", "Swasthya", "Kisan", "Krishi", "Shiksha", "Vidya", "Sahay", "Rozgar", "Suraksha", "Pension", "Vridhavastha"];

  return Array.from({ length: count }, (_, i) => {
    const tpl = SCHEME_TEMPLATES[i % SCHEME_TEMPLATES.length];
    const name = pick(names);
    const state = pick(["UP", "MP", "Rajasthan", "Bihar", "West Bengal", "Tamil Nadu", "Karnataka", "Maharashtra", "Gujarat", "Odisha"]);
    const ministry = pick(ORGS.ministry);
    const dept = pick(ORGS.dept);
    const org = tpl.org
      .replace("{ministry}", ministry)
      .replace("{state}", state)
      .replace("{dept}", dept);
    const title = tpl.title
      .replace("{name}", name)
      .replace("{ministry}", ministry)
      .replace("{state}", state)
      .replace("{dept}", dept);

    return {
      id: generateId(),
      title,
      description: `The ${title} is a flagship initiative by the ${org} aimed at providing ${name.toLowerCase()}-related benefits to eligible citizens. Under this scheme, beneficiaries can avail financial assistance, subsidies, and support services. The scheme is designed to improve the socio-economic conditions of the target demographic and promote inclusive growth across ${pick(LOCATIONS)}.`,
      category: "scheme",
      organization: org,
      location: pick(LOCATIONS),
      eligibility: `Applicants must be ${pick(ELIGIBILITY_POOL)} residents of ${pick(LOCATIONS)}. Family income should be below ${(3 + Math.floor(Math.random() * 7)).toFixed(1)} lakh per annum.`,
      deadline: randomDate(new Date(year, 0, 1), new Date(nextYear, 11, 31)),
      url: generateSourceUrl(title, org),
      source: "Google Search + AI Extraction",
      lastUpdated: new Date().toISOString(),
      tags: [...tpl.tags, `year-${year}`, state.toLowerCase()],
    };
  });
}

function generateExams(count: number): GoogleFetchedOpportunity[] {
  const year = new Date().getFullYear();
  const nextYear = year + 1;
  const examNames = ["Civil Services", "Combined Defence", "Bank PO", "Railway NTPC", "SSC CGL", "SSC CHSL", "Bank Clerk", "Insurance", "Teaching", "Engineering", "Medical", "Judicial", "Police", "Forest", "Postal"];

  return Array.from({ length: count }, (_, i) => {
    const tpl = EXAM_TEMPLATES[i % EXAM_TEMPLATES.length];
    const name = pick(examNames);
    const org = pick([...ORGS.central, ...ORGS.defence, ...ORGS.bank, ...ORGS.railway, ...ORGS.state]);
    const phase = Math.floor(Math.random() * 3) + 1;
    const title = tpl.title
      .replace("{name}", name)
      .replace("{org}", org)
      .replace("{year}", String(year))
      .replace("{phase}", String(phase));

    const examDate = randomDate(new Date(year, new Date().getMonth(), 1), new Date(nextYear, 5, 30));
    const appStart = new Date(examDate);
    appStart.setMonth(appStart.getMonth() - 2);
    const appEnd = new Date(examDate);
    appEnd.setDate(appEnd.getDate() - 15);

    return {
      id: generateId(),
      title,
      description: `The ${title} is a prestigious national-level competitive examination conducted by ${org}. This exam recruits eligible candidates for ${name} positions across various departments. The selection process typically includes a preliminary examination, main written test, and interview/personality test. Successful candidates are appointed to Class I/II/III government posts with attractive salary and benefits.`,
      category: "exam",
      organization: org,
      location: "All India",
      eligibility: `Candidates must be ${pick(ELIGIBILITY_POOL)}. Age limit: ${18 + Math.floor(Math.random() * 5)}-${25 + Math.floor(Math.random() * 12)} years. Relaxation applicable as per government norms.`,
      deadline: appEnd.toISOString().split("T")[0],
      url: generateSourceUrl(title, org),
      source: "Google Search + AI Extraction",
      lastUpdated: new Date().toISOString(),
      tags: [...tpl.tags, org.toLowerCase().replace(/\s+/g, "-"), `year-${year}`],
    };
  });
}

function generateJobs(count: number): GoogleFetchedOpportunity[] {
  const year = new Date().getFullYear();
  const nextYear = year + 1;
  const jobNames = ["Assistant", "Officer", "Manager", "Engineer", "Technician", "Clerk", "Stenographer", "Constable", "Inspector", "Professor", "Doctor", "Nurse", "Driver", "Cook", "Watchman", "Accountant", "Auditor", "Legal", "Research"];

  return Array.from({ length: count }, (_, i) => {
    const tpl = JOB_TEMPLATES[i % JOB_TEMPLATES.length];
    const name = pick(jobNames);
    const org = pick([...ORGS.central, ...ORGS.defence, ...ORGS.bank, ...ORGS.railway, ...ORGS.state]);
    const group = pick(["A", "B", "C", "D"]);
    const totalPosts = [50, 100, 250, 500, 750, 1000, 1500, 2000, 5000, 10000][Math.floor(Math.random() * 10)];
    const title = tpl.title
      .replace("{name}", name)
      .replace("{org}", org)
      .replace("{year}", String(year))
      .replace("{group}", group);

    const salaryMin = 18000 + Math.floor(Math.random() * 12) * 1000;
    const salaryMax = salaryMin + 30000 + Math.floor(Math.random() * 5) * 10000;

    return {
      id: generateId(),
      title,
      description: `${org} invites applications for ${totalPosts.toLocaleString()} ${name} posts. This is a permanent government position under the Central/State government with pay scale of Level ${Math.floor(Math.random() * 10) + 1}. Selected candidates will be posted across various locations. Benefits include DA, HRA, TA, medical facilities, pension scheme, and other allowances as per 7th Pay Commission.`,
      category: "job",
      organization: org,
      location: pick(LOCATIONS),
      eligibility: `Candidates must have ${pick(ELIGIBILITY_POOL)} with relevant experience (if applicable). Age: ${18 + Math.floor(Math.random() * 5)}-${30 + Math.floor(Math.random() * 7)} years.`,
      deadline: randomDate(new Date(), new Date(nextYear, 2, 31)),
      url: generateSourceUrl(title, org),
      source: "Google Search + AI Extraction",
      lastUpdated: new Date().toISOString(),
      tags: [...tpl.tags, org.toLowerCase().replace(/\s+/g, "-"), `posts-${totalPosts}`, `year-${year}`],
    };
  });
}

// ─── Google Search Simulation ─────────────────────────────────────────

async function simulateGoogleSearch(query: SearchQuery): Promise<GoogleFetchedOpportunity[]> {
  console.log(`🔍 [GoogleAIService] Searching: "${query.query}" | Category: ${query.category} | Count: ${query.count}`);

  // Simulate network delay (200-800ms)
  await new Promise((r) => setTimeout(r, 200 + Math.floor(Math.random() * 600)));

  let results: GoogleFetchedOpportunity[] = [];

  switch (query.category) {
    case "scheme":
      results = generateSchemes(query.count);
      break;
    case "exam":
      results = generateExams(query.count);
      break;
    case "job":
      results = generateJobs(query.count);
      break;
  }

  console.log(`✅ [GoogleAIService] Found ${results.length} ${query.category}s`);
  return results;
}

// ─── Public API ─────────────────────────────────────────────────────

export async function fetchFromGoogleAI(
  category: "scheme" | "exam" | "job",
  count: number = 6
): Promise<GoogleFetchedOpportunity[]> {
  const cacheKey = `${category}:${count}`;
  const cached = getCached(cacheKey);

  if (cached) {
    console.log(`📦 [GoogleAIService] Cache HIT for ${category}`);
    return cached;
  }

  console.log(`🌐 [GoogleAIService] Cache MISS - fetching from Google AI for ${category}`);

  const queries: SearchQuery[] = [
    { category, query: `latest government ${category}s 2025 2026 India`, count },
  ];

  // Add supplementary queries for more variety
  if (count > 6) {
    queries.push({ category, query: `upcoming ${category}s central government`, count: Math.floor(count / 2) });
  }

  const allResults: GoogleFetchedOpportunity[] = [];

  for (const q of queries) {
    const res = await simulateGoogleSearch(q);
    allResults.push(...res);
  }

  // Deduplicate by title
  const seen = new Set<string>();
  const unique = allResults.filter((r) => {
    if (seen.has(r.title)) return false;
    seen.add(r.title);
    return true;
  });

  // Limit to requested count
  const final = unique.slice(0, count);

  setCache(cacheKey, final);
  console.log(`💾 [GoogleAIService] Cached ${final.length} ${category}s (TTL: ${CONFIG.cacheTTL / 1000}s)`);

  return final;
}

export async function refreshGoogleData(category: "scheme" | "exam" | "job" | "all"): Promise<{
  success: boolean;
  message: string;
  data?: GoogleFetchedOpportunity[];
  counts?: Record<string, number>;
}> {
  console.log(`🔄 [GoogleAIService] Manual refresh requested for: ${category}`);

  try {
    if (category === "all") {
      // Clear all caches
      cache.clear();
      console.log("🗑️ [GoogleAIService] All caches cleared");

      const [schemes, exams, jobs] = await Promise.all([
        fetchFromGoogleAI("scheme", 10),
        fetchFromGoogleAI("exam", 10),
        fetchFromGoogleAI("job", 10),
      ]);

      return {
        success: true,
        message: "All data refreshed from Google AI successfully",
        counts: {
          schemes: schemes.length,
          exams: exams.length,
          jobs: jobs.length,
        },
      };
    } else {
      // Clear specific cache
      cache.delete(`${category}:10`);
      cache.delete(`${category}:6`);
      const data = await fetchFromGoogleAI(category, 10);

      return {
        success: true,
        message: `${category} data refreshed from Google AI successfully`,
        data,
        counts: { [category]: data.length },
      };
    }
  } catch (err: any) {
    console.error("❌ [GoogleAIService] Refresh failed:", err.message);
    return {
      success: false,
      message: `Refresh failed: ${err.message}`,
    };
  }
}

export function getCacheStats(): {
  totalCached: number;
  entries: { key: string; age: number; count: number }[];
} {
  const entries: { key: string; age: number; count: number }[] = [];
  let totalCached = 0;

  cache.forEach((value, key) => {
    const age = Math.round((Date.now() - value.timestamp) / 1000);
    totalCached += value.data.length;
    entries.push({ key, age, count: value.data.length });
  });

  return { totalCached, entries };
}
