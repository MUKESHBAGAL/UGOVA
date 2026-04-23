import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Check if OpenAI is configured
const isAIConfigured = () => !!process.env.OPENAI_API_KEY

// Current year for realistic dates
const currentYear = new Date().getFullYear()
const nextYear = currentYear + 1

// Government organizations pools
const ministries = [
  'Ministry of Agriculture & Farmers Welfare',
  'Ministry of Education',
  'Ministry of Health & Family Welfare',
  'Ministry of Housing and Urban Affairs',
  'Ministry of Skill Development & Entrepreneurship',
  'Ministry of Finance',
  'Ministry of Defence',
  'Ministry of Railways',
  'Ministry of Home Affairs',
  'Ministry of Labour & Employment',
  'Ministry of Social Justice & Empowerment',
  'Ministry of Women & Child Development',
  'Ministry of Minority Affairs',
  'Ministry of Tribal Affairs',
  'Ministry of MSME',
  'Ministry of Textiles',
  'Ministry of Petroleum & Natural Gas',
  'Ministry of Power',
  'Ministry of Road Transport & Highways',
  'Ministry of Communications',
]

const organizations = [
  'Union Public Service Commission (UPSC)',
  'Staff Selection Commission (SSC)',
  'Institute of Banking Personnel Selection (IBPS)',
  'Railway Recruitment Board (RRB)',
  'National Testing Agency (NTA)',
  'State Bank of India (SBI)',
  'Reserve Bank of India (RBI)',
  'Indian Railways',
  'Defence Research & Development Organisation (DRDO)',
  'Indian Army',
  'Indian Navy',
  'Indian Air Force',
  'Central Industrial Security Force (CISF)',
  'Border Security Force (BSF)',
  'Central Reserve Police Force (CRPF)',
  'National Thermal Power Corporation (NTPC)',
  'Oil and Natural Gas Corporation (ONGC)',
  'Bharat Heavy Electricals Limited (BHEL)',
  'National Highways Authority of India (NHAI)',
  'Food Corporation of India (FCI)',
  'Life Insurance Corporation (LIC)',
  'New India Assurance',
  'National Informatics Centre (NIC)',
  'National Health Authority',
  'NITI Aayog',
  'Election Commission of India',
]

const schemeTemplates = [
  {
    title: 'PM Kisan Samman Nidhi Yojana',
    category: 'agriculture',
    description: 'Direct income support of Rs. 6,000 per year to farmer families, payable in three equal installments of Rs. 2,000 each. Aims to supplement financial needs of land holding farmers.',
    eligibility: 'Small and marginal farmer families having cultivable land up to 2 hectares',
    benefits: 'Rs. 6,000 per year in three installments directly to bank account',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    organization: 'Department of Agriculture',
    url: 'https://pmkisan.gov.in',
  },
  {
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'health',
    description: 'World\'s largest government-funded healthcare program providing health coverage up to Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.',
    eligibility: 'Families identified in SECC 2011 database (bottom 40% of population)',
    benefits: 'Health coverage up to Rs. 5 lakh per family per year, cashless treatment at empaneled hospitals',
    ministry: 'Ministry of Health & Family Welfare',
    organization: 'National Health Authority',
    url: 'https://pmjay.gov.in',
  },
  {
    title: 'Pradhan Mantri Awas Yojana - Urban',
    category: 'housing',
    description: 'Housing for All scheme providing affordable housing with interest subsidy on home loans for Economically Weaker Sections and Low Income Groups.',
    eligibility: 'EWS/LIG households with annual income up to Rs. 6 lakh/18 lakh',
    benefits: 'Interest subsidy up to Rs. 2.67 lakh on home loans, affordable housing units',
    ministry: 'Ministry of Housing and Urban Affairs',
    organization: 'Housing & Urban Development Corporation',
    url: 'https://pmaymis.gov.in',
  },
  {
    title: 'National Scholarship Portal - Post Matric',
    category: 'education',
    description: 'Single window digital platform for various post-matric scholarship schemes for students from SC/ST/OBC/Minority categories pursuing higher education.',
    eligibility: 'Students from SC/ST/OBC/Minority categories with family income below prescribed limit',
    benefits: 'Full tuition fee, maintenance allowance, and other academic expenses reimbursement',
    ministry: 'Ministry of Education',
    organization: 'Department of Higher Education',
    url: 'https://scholarships.gov.in',
  },
  {
    title: 'Pradhan Mantri Mudra Yojana',
    category: 'finance',
    description: 'Micro Units Development and Refinance Agency providing loans up to Rs. 10 lakh to non-corporate small/micro enterprises for income-generating activities.',
    eligibility: 'Small business owners, entrepreneurs, shopkeepers, artisans, fruit/vegetable sellers',
    benefits: 'Loans from Rs. 50,000 (Shishu) to Rs. 10 lakh (Tarun) at subsidized rates without collateral',
    ministry: 'Ministry of Finance',
    organization: 'SIDBI',
    url: 'https://mudra.org.in',
  },
  {
    title: 'Pradhan Mantri Kaushal Vikas Yojana 4.0',
    category: 'skill-development',
    description: 'Flagship skill development scheme providing free short-term training and certification to youth in industry-relevant skills with placement support.',
    eligibility: 'Indian youth aged 15-45 years, school/college dropouts, unemployed youth',
    benefits: 'Free skill training, NSDC certification, placement assistance, stipend up to Rs. 1,500/month',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    organization: 'National Skill Development Corporation',
    url: 'https://skillindia.gov.in',
  },
  {
    title: 'Pradhan Mantri Jan Dhan Yojana',
    category: 'finance',
    description: 'Financial inclusion program providing universal access to banking facilities with zero balance savings account, debit card, and accident insurance.',
    eligibility: 'All Indian citizens above 10 years of age without a bank account',
    benefits: 'Zero balance account, RuPay debit card, Rs. 2 lakh accident insurance, overdraft facility up to Rs. 10,000',
    ministry: 'Ministry of Finance',
    organization: 'Department of Financial Services',
    url: 'https://pmjdy.gov.in',
  },
  {
    title: 'Atal Pension Yojana',
    category: 'social-welfare',
    description: 'Pension scheme for unorganized sector workers providing guaranteed minimum pension of Rs. 1,000 to Rs. 5,000 per month after 60 years of age.',
    eligibility: 'Indian citizens aged 18-40 years with savings bank account',
    benefits: 'Guaranteed pension Rs. 1,000-5,000/month from age 60, spouse pension, corpus return to nominees',
    ministry: 'Ministry of Finance',
    organization: 'Pension Fund Regulatory Authority (PFRDA)',
    url: 'https://npscra.nsdl.co.in',
  },
  {
    title: 'Pradhan Mantri Suraksha Bima Yojana',
    category: 'social-welfare',
    description: 'Accident insurance scheme providing coverage against accidental death and disability at a nominal premium of Rs. 20 per year.',
    eligibility: 'Indian citizens aged 18-70 years with savings bank account',
    benefits: 'Accidental death/disability cover of Rs. 2 lakh, partial disability cover of Rs. 1 lakh',
    ministry: 'Ministry of Finance',
    organization: 'Department of Financial Services',
    url: 'https://jansuraksha.gov.in',
  },
  {
    title: 'Sukanya Samriddhi Yojana',
    category: 'finance',
    description: 'Small savings scheme for girl child education and marriage expenses with one of the highest interest rates among small savings schemes.',
    eligibility: 'Parents/guardians of girl child below 10 years of age',
    benefits: 'Higher interest rate (currently 8.2%), tax deduction under Section 80C, maturity amount tax-free',
    ministry: 'Ministry of Finance',
    organization: 'Department of Posts / Banks',
    url: 'https://www.nsiindia.gov.in',
  },
  {
    title: 'PM Vishwakarma Scheme',
    category: 'skill-development',
    description: 'Comprehensive scheme for traditional artisans and craftspeople providing skill training, toolkit support, and credit assistance.',
    eligibility: 'Traditional artisans and craftspeople (weavers, potters, carpenters, etc.) aged 18+',
    benefits: 'Rs. 15,000 toolkit voucher, skill training, credit support up to Rs. 3 lakh at 5% interest',
    ministry: 'Ministry of MSME',
    organization: 'Ministry of Micro, Small & Medium Enterprises',
    url: 'https://pmvishwakarma.gov.in',
  },
  {
    title: 'Stand-Up India Scheme',
    category: 'finance',
    description: 'Bank loan facility for SC/ST and women entrepreneurs to set up new enterprises in manufacturing, services, or trading sectors.',
    eligibility: 'SC/ST or women entrepreneurs aged 18+ for new enterprises',
    benefits: 'Bank loans from Rs. 10 lakh to Rs. 1 crore, composite loan (term + working capital)',
    ministry: 'Ministry of Finance',
    organization: 'SIDBI',
    url: 'https://www.standupmitra.in',
  },
  {
    title: 'National Livelihood Mission - Aajeevika',
    category: 'employment',
    description: 'Poverty alleviation program creating self-employment and skilled wage employment opportunities for rural poor households.',
    eligibility: 'Rural poor households identified through BPL survey',
    benefits: 'Skill training, credit linkage, market access support, interest subsidy on loans',
    ministry: 'Ministry of Rural Development',
    organization: 'National Rural Livelihood Mission',
    url: 'https://aajeevika.gov.in',
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    category: 'agriculture',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen natural calamities.',
    eligibility: 'All farmers growing notified crops in notified areas',
    benefits: 'Insurance cover for crop loss, lowest premium rates (1.5%-5%), full claim settlement',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    organization: 'Agriculture Insurance Company',
    url: 'https://pmfby.gov.in',
  },
  {
    title: 'PM eVIDYA Scheme',
    category: 'education',
    description: 'Digital education initiative providing multi-mode access to education through TV channels, radio, podcasts, and online platforms.',
    eligibility: 'All students from primary to higher secondary levels',
    benefits: '12 dedicated TV channels, DIKSHA platform, online classes, study materials in regional languages',
    ministry: 'Ministry of Education',
    organization: 'NCERT / CBSE',
    url: 'https://pmvidya.gov.in',
  },
]

const examTemplates = [
  {
    title: `UPSC Civil Services Examination ${nextYear}`,
    examType: 'upsc',
    description: `Civil Services (Preliminary) Examination for recruitment to IAS, IPS, IFS, IRS, and other Group A & B central services. One of India's most prestigious competitive examinations.`,
    organization: 'Union Public Service Commission (UPSC)',
    eligibility: 'Graduate in any discipline from a recognized university',
    applicationStart: `${nextYear}-02-14`,
    applicationEnd: `${nextYear}-03-05`,
    examDate: `${nextYear}-05-25`,
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 1056,
    ageLimit: { min: 21, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://upsc.gov.in',
  },
  {
    title: `SSC CGL ${nextYear}`,
    examType: 'ssc',
    description: `Combined Graduate Level Examination for Group B and C posts in various ministries, departments, and organizations of the Government of India.`,
    organization: 'Staff Selection Commission (SSC)',
    eligibility: 'Graduate from a recognized university in any discipline',
    applicationStart: `${nextYear}-06-11`,
    applicationEnd: `${nextYear}-07-10`,
    examDate: `${nextYear}-09-15`,
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 7500,
    ageLimit: { min: 18, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ssc.gov.in',
  },
  {
    title: `IBPS PO/MT ${nextYear}`,
    examType: 'banking',
    description: `Common Recruitment Process for Probationary Officer/Management Trainee positions in participating public sector banks.`,
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    eligibility: 'Graduate in any discipline from a recognized university',
    applicationStart: `${nextYear}-07-01`,
    applicationEnd: `${nextYear}-07-21`,
    examDate: `${nextYear}-10-19`,
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    totalPosts: 4872,
    ageLimit: { min: 20, max: 30 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ibps.in',
  },
  {
    title: `SSC CHSL ${nextYear}`,
    examType: 'ssc',
    description: `Combined Higher Secondary Level examination for Lower Divisional Clerk, Data Entry Operator, and Postal/Sorting Assistant posts.`,
    organization: 'Staff Selection Commission (SSC)',
    eligibility: '12th Pass or equivalent from a recognized Board/University',
    applicationStart: `${nextYear}-04-01`,
    applicationEnd: `${nextYear}-05-01`,
    examDate: `${nextYear}-07-20`,
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 5000,
    ageLimit: { min: 18, max: 27 },
    qualification: '12th Pass',
    state: 'All India',
    url: 'https://ssc.gov.in',
  },
  {
    title: `RRB NTPC ${nextYear}`,
    examType: 'railway',
    description: `Non-Technical Popular Categories recruitment for various posts including Junior Clerk, Accounts Clerk, Traffic Assistant, Goods Guard, and Station Master.`,
    organization: 'Railway Recruitment Board (RRB)',
    eligibility: '12th Pass or Graduate depending on the post applied',
    applicationStart: `${nextYear}-08-01`,
    applicationEnd: `${nextYear}-08-30`,
    examDate: `${nextYear}-12-15`,
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    totalPosts: 35000,
    ageLimit: { min: 18, max: 33 },
    qualification: '12th Pass / Graduate',
    state: 'All India',
    url: 'https://rrbcdg.gov.in',
  },
  {
    title: `IBPS Clerk ${nextYear}`,
    examType: 'banking',
    description: `Common Recruitment Process for Clerical cadre positions in participating public sector banks and regional rural banks.`,
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    eligibility: 'Graduate in any discipline with computer literacy and local language proficiency',
    applicationStart: `${nextYear}-07-01`,
    applicationEnd: `${nextYear}-07-28`,
    examDate: `${nextYear}-08-24`,
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    totalPosts: 6035,
    ageLimit: { min: 20, max: 28 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ibps.in',
  },
  {
    title: `NDA & NA Examination (I) ${nextYear}`,
    examType: 'defence',
    description: `National Defence Academy and Naval Academy examination for Army, Navy, and Air Force wings after 10+2 level education.`,
    organization: 'Union Public Service Commission (UPSC)',
    eligibility: '12th pass or appearing in Physics, Chemistry, and Mathematics for Air Force/Naval Academy',
    applicationStart: `${nextYear}-12-20`,
    applicationEnd: `${currentYear}-01-09`,
    examDate: `${nextYear}-04-21`,
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 400,
    ageLimit: { min: 16, max: 19 },
    qualification: '12th Pass',
    state: 'All India',
    url: 'https://upsc.gov.in',
  },
  {
    title: `SSC MTS & Havaldar ${nextYear}`,
    examType: 'ssc',
    description: `Multi-Tasking Staff and Havaldar recruitment for Group C non-gazetted, non-ministerial posts in various ministries and departments.`,
    organization: 'Staff Selection Commission (SSC)',
    eligibility: '10th Pass or equivalent from a recognized board',
    applicationStart: `${nextYear}-06-01`,
    applicationEnd: `${nextYear}-06-30`,
    examDate: `${nextYear}-09-01`,
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 11000,
    ageLimit: { min: 18, max: 25 },
    qualification: '10th Pass',
    state: 'All India',
    url: 'https://ssc.gov.in',
  },
  {
    title: `SBI PO ${nextYear}`,
    examType: 'banking',
    description: `State Bank of India Probationary Officer recruitment for management trainee positions across all SBI branches in India.`,
    organization: 'State Bank of India (SBI)',
    eligibility: 'Graduate in any discipline from a recognized university',
    applicationStart: `${nextYear}-09-01`,
    applicationEnd: `${nextYear}-09-27`,
    examDate: `${nextYear}-11-08`,
    applicationFee: { general: 750, obc: 750, sc: 0, st: 0, ews: 750 },
    totalPosts: 2000,
    ageLimit: { min: 21, max: 30 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://sbi.co.in',
  },
  {
    title: `CDS Examination (I) ${nextYear}`,
    examType: 'defence',
    description: `Combined Defence Services examination for Indian Military Academy, Indian Naval Academy, Air Force Academy, and Officers Training Academy.`,
    organization: 'Union Public Service Commission (UPSC)',
    eligibility: 'Graduate for IMA/OTA, B.E./B.Tech for INA, 12th with Physics & Math for AFA',
    applicationStart: `${nextYear}-12-20`,
    applicationEnd: `${currentYear}-01-09`,
    examDate: `${nextYear}-04-16`,
    applicationFee: { general: 200, obc: 200, sc: 0, st: 0, ews: 200 },
    totalPosts: 459,
    ageLimit: { min: 19, max: 25 },
    qualification: 'Graduate / 12th Pass',
    state: 'All India',
    url: 'https://upsc.gov.in',
  },
  {
    title: `AFCAT ${nextYear}`,
    examType: 'defence',
    description: `Air Force Common Admission Test for Flying Branch, Ground Duty (Technical), and Ground Duty (Non-Technical) branches.`,
    organization: 'Indian Air Force',
    eligibility: 'Graduate with 60% marks (Flying/Non-Tech), B.E./B.Tech with 60% (Technical)',
    applicationStart: `${nextYear}-11-01`,
    applicationEnd: `${nextYear}-11-30`,
    examDate: `${nextYear}-02-16`,
    applicationFee: { general: 550, obc: 550, sc: 550, st: 550, ews: 550 },
    totalPosts: 317,
    ageLimit: { min: 20, max: 26 },
    qualification: 'Graduate / B.Tech',
    state: 'All India',
    url: 'https://afcat.cdac.in',
  },
  {
    title: `RBI Grade B Officer ${nextYear}`,
    examType: 'banking',
    description: `Reserve Bank of India recruitment for Grade B Officers in General, DEPR, and DSIM streams.`,
    organization: 'Reserve Bank of India (RBI)',
    eligibility: 'Graduate in any discipline with minimum 60% marks (50% for SC/ST/PwBD)',
    applicationStart: `${nextYear}-05-01`,
    applicationEnd: `${nextYear}-05-21`,
    examDate: `${nextYear}-07-09`,
    applicationFee: { general: 850, obc: 850, sc: 100, st: 100, ews: 850 },
    totalPosts: 291,
    ageLimit: { min: 21, max: 30 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://rbi.org.in',
  },
]

const jobTemplates = [
  {
    title: 'UPSC Civil Services - IAS Officer',
    department: 'Indian Administrative Service',
    jobType: 'permanent',
    location: 'All India Cadre (State postings)',
    organization: 'Union Public Service Commission (UPSC)',
    eligibility: 'Graduate in any discipline from recognized university, must clear UPSC CSE',
    qualification: 'Graduate',
    experience: 'Fresher (through examination)',
    salaryRange: { min: 56100, max: 250000 },
    totalPosts: 180,
    applicationStart: `${nextYear}-02-14`,
    applicationEnd: `${nextYear}-03-05`,
    ageLimit: { min: 21, max: 32 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Civil Services Prelims, Mains Examination, Personality Test (Interview), Medical Examination',
    state: 'All India',
    url: 'https://upsc.gov.in',
  },
  {
    title: 'SSC CGL - Assistant Section Officer',
    department: 'Central Secretariat Service / AFHQ / Intelligence Bureau',
    jobType: 'permanent',
    location: 'Delhi, Mumbai, Kolkata, Chennai and other metro cities',
    organization: 'Staff Selection Commission (SSC)',
    eligibility: 'Graduate from recognized university with Computer Proficiency Test qualification',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 44900, max: 142400 },
    totalPosts: 3600,
    applicationStart: `${nextYear}-06-11`,
    applicationEnd: `${nextYear}-07-10`,
    ageLimit: { min: 18, max: 30 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Tier-I Computer Based Exam, Tier-II Computer Based Exam, Tier-III Descriptive Paper, Document Verification',
    state: 'All India',
    url: 'https://ssc.gov.in',
  },
  {
    title: 'SBI Probationary Officer (PO)',
    department: 'State Bank of India - Various Branches',
    jobType: 'permanent',
    location: 'Pan India (All SBI branches and offices)',
    organization: 'State Bank of India (SBI)',
    eligibility: 'Graduate in any discipline from a recognized University/Institution',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 36000, max: 63000 },
    totalPosts: 2000,
    applicationStart: `${nextYear}-09-01`,
    applicationEnd: `${nextYear}-09-27`,
    ageLimit: { min: 21, max: 30 },
    applicationFee: { general: 750, obc: 750, sc: 0, st: 0, ews: 750 },
    selectionProcess: 'Phase-I Preliminary Exam, Phase-II Main Exam, Phase-III Group Exercise & Interview, Document Verification',
    state: 'All India',
    url: 'https://sbi.co.in',
  },
  {
    title: 'Indian Railways - RRB NTPC Graduate Posts',
    department: 'Indian Railways - Various Zonal Railways',
    jobType: 'permanent',
    location: 'All Zonal Railways across India',
    organization: 'Railway Recruitment Board (RRB)',
    eligibility: 'Graduate from recognized university for Graduate level posts',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 19900, max: 44900 },
    totalPosts: 35000,
    applicationStart: `${nextYear}-08-01`,
    applicationEnd: `${nextYear}-08-30`,
    ageLimit: { min: 18, max: 33 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    selectionProcess: 'CBT Stage 1, CBT Stage 2, Typing Skill Test / Computer Based Aptitude Test, Document Verification, Medical Examination',
    state: 'All India',
    url: 'https://rrbcdg.gov.in',
  },
  {
    title: 'DRDO Scientist B Recruitment',
    department: 'Defence Research & Development Organisation',
    jobType: 'permanent',
    location: 'DRDO Labs across India (Delhi, Pune, Hyderabad, Bengaluru, etc.)',
    organization: 'Defence Research & Development Organisation (DRDO)',
    eligibility: 'B.E./B.Tech/M.Sc in relevant discipline from recognized university with valid GATE score',
    qualification: 'B.E./B.Tech/M.Sc',
    experience: 'Fresher',
    salaryRange: { min: 56100, max: 177500 },
    totalPosts: 630,
    applicationStart: `${nextYear}-01-15`,
    applicationEnd: `${nextYear}-02-14`,
    ageLimit: { min: 18, max: 28 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'GATE Score based shortlisting, Personal Interview, Document Verification, Medical Examination',
    state: 'All India',
    url: 'https://drdo.gov.in',
  },
  {
    title: 'Indian Army Agniveer (General Duty)',
    department: 'Indian Army - Various Regiments',
    jobType: 'contract',
    location: 'All India (Training at Army Training Centers)',
    organization: 'Indian Army',
    eligibility: '10th/12th Pass with minimum 45% marks, age 17.5-21 years, physical fitness as per Army standards',
    qualification: '10th/12th Pass',
    experience: 'Fresher',
    salaryRange: { min: 30000, max: 40000 },
    totalPosts: 25000,
    applicationStart: `${nextYear}-01-01`,
    applicationEnd: `${nextYear}-02-15`,
    ageLimit: { min: 17, max: 23 },
    applicationFee: { general: 0, obc: 0, sc: 0, st: 0, ews: 0 },
    selectionProcess: 'Online Registration, Physical Fitness Test (Running, Pull-ups, Balance), Medical Examination, Written Exam (CBT)',
    state: 'All India',
    url: 'https://joinindianarmy.nic.in',
  },
  {
    title: 'Bharat Electronics Limited - Engineer',
    department: 'BEL - Various Units (Bengaluru, Pune, Hyderabad, etc.)',
    jobType: 'permanent',
    location: 'Bengaluru, Pune, Hyderabad, Chennai, and other units',
    organization: 'Bharat Electronics Limited (BEL)',
    eligibility: 'B.E./B.Tech in Electronics/Computer Science/Mechanical/Electrical from recognized university',
    qualification: 'B.E./B.Tech',
    experience: 'Fresher (up to 1 year acceptable)',
    salaryRange: { min: 40000, max: 140000 },
    totalPosts: 350,
    applicationStart: `${nextYear}-03-01`,
    applicationEnd: `${nextYear}-03-31`,
    ageLimit: { min: 18, max: 28 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    selectionProcess: 'Written Test (Technical + Aptitude), Interview, Document Verification, Medical Examination',
    state: 'All India',
    url: 'https://bel-india.in',
  },
  {
    title: 'ONGC Graduate Trainee',
    department: 'Oil and Natural Gas Corporation Limited',
    jobType: 'permanent',
    location: 'ONGC operational areas across India (Mumbai, Ahmedabad, Dehradun, etc.)',
    organization: 'Oil and Natural Gas Corporation (ONGC)',
    eligibility: 'B.E./B.Tech/M.Sc in relevant discipline with minimum 60% marks, valid GATE score',
    qualification: 'B.E./B.Tech/M.Sc',
    experience: 'Fresher',
    salaryRange: { min: 50000, max: 160000 },
    totalPosts: 280,
    applicationStart: `${nextYear}-02-01`,
    applicationEnd: `${nextYear}-03-01`,
    ageLimit: { min: 18, max: 30 },
    applicationFee: { general: 500, obc: 500, sc: 0, st: 0, ews: 500 },
    selectionProcess: 'GATE Score Shortlisting, Personal Interview, Document Verification, Medical Examination',
    state: 'All India',
    url: 'https://ongcindia.com',
  },
  {
    title: 'NTPC Engineering Executive Trainee',
    department: 'National Thermal Power Corporation Limited',
    jobType: 'permanent',
    location: 'NTPC plants and offices across India',
    organization: 'National Thermal Power Corporation (NTPC)',
    eligibility: 'B.E./B.Tech in Electrical/Mechanical/Electronics/Civil/IT with minimum 65% marks, valid GATE score',
    qualification: 'B.E./B.Tech',
    experience: 'Fresher',
    salaryRange: { min: 50000, max: 160000 },
    totalPosts: 300,
    applicationStart: `${nextYear}-03-15`,
    applicationEnd: `${nextYear}-04-15`,
    ageLimit: { min: 18, max: 27 },
    applicationFee: { general: 300, obc: 300, sc: 0, st: 0, ews: 300 },
    selectionProcess: 'GATE Score Based Shortlisting, Group Discussion, Personal Interview, Document Verification, Medical Test',
    state: 'All India',
    url: 'https://ntpc.co.in',
  },
  {
    title: 'FCI Manager - General/Depot/Movement',
    department: 'Food Corporation of India',
    jobType: 'permanent',
    location: 'FCI offices and depots across India',
    organization: 'Food Corporation of India (FCI)',
    eligibility: 'Graduate in relevant discipline (B.E./B.Tech/MBA/CA for specific posts)',
    qualification: 'Graduate / B.E. / MBA',
    experience: 'Fresher (up to 2 years for some posts)',
    salaryRange: { min: 40000, max: 140000 },
    totalPosts: 490,
    applicationStart: `${nextYear}-08-01`,
    applicationEnd: `${nextYear}-08-31`,
    ageLimit: { min: 18, max: 28 },
    applicationFee: { general: 800, obc: 800, sc: 0, st: 0, ews: 800 },
    selectionProcess: 'Online Test (Phase-I), Online Test (Phase-II), Document Verification, Interview, Medical Examination',
    state: 'All India',
    url: 'https://fci.gov.in',
  },
]

// Helper to generate random dates
function getRandomDeadline(): string {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const month = months[Math.floor(Math.random() * months.length)]
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
  return `${nextYear}-${month}-${day}`
}

// Generate schemes with AI enrichment when API key available
export async function generateSchemes(count: number = 15): Promise<any[]> {
  const schemes = schemeTemplates.slice(0, count).map((template, index) => ({
    _id: `scheme-${index + 1}`,
    ...template,
    deadline: getRandomDeadline(),
    totalApplications: Math.floor(Math.random() * 500000) + 50000,
    isActive: true,
    state: 'All India',
  }))

  // If OpenAI is configured, enhance descriptions with current context
  if (isAIConfigured() && count <= 5) {
    try {
      const prompt = `Generate ${count} current Indian government welfare scheme entries with these exact fields for each: title, category (agriculture/health/housing/education/finance/skill-development/social-welfare/employment), description (2-3 sentences), ministry, organization, eligibility (1 sentence), benefits (1 sentence), official_url. Make them realistic, current ${currentYear} schemes. Return as JSON array.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a government data curator. Return only valid JSON arrays with realistic Indian government scheme data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const content = completion.choices[0].message.content || '[]'
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const aiSchemes = JSON.parse(jsonMatch[0])
        return aiSchemes.map((s: any, i: number) => ({
          _id: `scheme-ai-${i + 1}`,
          title: s.title || schemes[i]?.title || 'Government Scheme',
          category: s.category || 'other',
          description: s.description || '',
          ministry: s.ministry || '',
          organization: s.organization || '',
          eligibility: s.eligibility || '',
          benefits: s.benefits || '',
          url: s.official_url || s.url || '',
          deadline: getRandomDeadline(),
          state: 'All India',
          totalApplications: Math.floor(Math.random() * 500000) + 50000,
          isActive: true,
        }))
      }
    } catch (error) {
      console.warn('AI scheme generation failed, using templates:', error)
    }
  }

  return schemes
}

// Generate exams
export async function generateExams(count: number = 12): Promise<any[]> {
  const exams = examTemplates.slice(0, count).map((template, index) => ({
    _id: `exam-${index + 1}`,
    ...template,
    totalApplications: Math.floor(Math.random() * 2000000) + 100000,
    isActive: true,
  }))

  if (isAIConfigured() && count <= 5) {
    try {
      const prompt = `Generate ${count} current Indian government competitive examination entries with these exact fields: title, examType (upsc/ssc/banking/defence/railway/central/state/other), description (2 sentences), organization, eligibility (1 sentence), applicationStart (YYYY-MM-DD), applicationEnd (YYYY-MM-DD), examDate (YYYY-MM-DD), totalPosts (number), ageLimitMin (number), ageLimitMax (number), qualification (short), url. Use dates in ${nextYear}. Return as JSON array.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a government exam information curator. Return only valid JSON arrays with realistic Indian competitive exam data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const content = completion.choices[0].message.content || '[]'
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const aiExams = JSON.parse(jsonMatch[0])
        return aiExams.map((e: any, i: number) => ({
          _id: `exam-ai-${i + 1}`,
          title: e.title || exams[i]?.title || 'Competitive Exam',
          examType: e.examType || 'other',
          description: e.description || '',
          organization: e.organization || '',
          eligibility: e.eligibility || '',
          applicationStart: e.applicationStart || `${nextYear}-01-01`,
          applicationEnd: e.applicationEnd || `${nextYear}-12-31`,
          examDate: e.examDate || `${nextYear}-06-15`,
          applicationFee: exams[i]?.applicationFee || { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
          totalPosts: e.totalPosts || 1000,
          ageLimit: { min: e.ageLimitMin || 18, max: e.ageLimitMax || 30 },
          qualification: e.qualification || 'Graduate',
          state: 'All India',
          url: e.url || '',
          totalApplications: Math.floor(Math.random() * 2000000) + 100000,
          isActive: true,
        }))
      }
    } catch (error) {
      console.warn('AI exam generation failed, using templates:', error)
    }
  }

  return exams
}

// Generate jobs
export async function generateJobs(count: number = 10): Promise<any[]> {
  const jobs = jobTemplates.slice(0, count).map((template, index) => ({
    _id: `job-${index + 1}`,
    ...template,
    totalApplications: Math.floor(Math.random() * 1000000) + 50000,
    isActive: true,
  }))

  if (isAIConfigured() && count <= 5) {
    try {
      const prompt = `Generate ${count} current Indian government job entries with these exact fields: title, department, organization, jobType (permanent/contract/temporary/apprenticeship), location, eligibility (1-2 sentences), qualification (short), experience (short), salaryMin (number), salaryMax (number), totalPosts (number), applicationStart (YYYY-MM-DD), applicationEnd (YYYY-MM-DD), ageLimitMin (number), ageLimitMax (number), selectionProcess (short), url. Use dates in ${nextYear}. Return as JSON array.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a government job information curator. Return only valid JSON arrays with realistic Indian government job data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const content = completion.choices[0].message.content || '[]'
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const aiJobs = JSON.parse(jsonMatch[0])
        return aiJobs.map((j: any, i: number) => ({
          _id: `job-ai-${i + 1}`,
          title: j.title || jobs[i]?.title || 'Government Job',
          department: j.department || '',
          organization: j.organization || '',
          jobType: j.jobType || 'permanent',
          location: j.location || 'All India',
          eligibility: j.eligibility || '',
          qualification: j.qualification || 'Graduate',
          experience: j.experience || 'Fresher',
          salaryRange: { min: j.salaryMin || 30000, max: j.salaryMax || 150000 },
          totalPosts: j.totalPosts || 500,
          applicationStart: j.applicationStart || `${nextYear}-01-01`,
          applicationEnd: j.applicationEnd || `${nextYear}-12-31`,
          ageLimit: { min: j.ageLimitMin || 18, max: j.ageLimitMax || 30 },
          applicationFee: jobs[i]?.applicationFee || { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
          selectionProcess: j.selectionProcess || 'Written Exam, Interview, Document Verification',
          state: 'All India',
          url: j.url || '',
          totalApplications: Math.floor(Math.random() * 1000000) + 50000,
          isActive: true,
        }))
      }
    } catch (error) {
      console.warn('AI job generation failed, using templates:', error)
    }
  }

  return jobs
}

// Generate combined data for all three types
export async function generateAllData() {
  const [schemes, exams, jobs] = await Promise.all([
    generateSchemes(15),
    generateExams(12),
    generateJobs(10)
  ])

  return { schemes, exams, jobs }
}
