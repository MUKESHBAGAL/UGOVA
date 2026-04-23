import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Scheme from '@/models/Scheme'
import Exam from '@/models/Exam'
import Job from '@/models/Job'

const schemesData = [
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of Rs. 6000 per year to farmer families across the country.',
    organization: 'Ministry of Agriculture',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'agriculture',
    eligibility: 'Small and marginal farmer families having cultivable land',
    benefits: 'Rs. 6000 per year in three installments',
    deadline: new Date('2024-12-31'),
    state: 'All India',
    url: 'https://pmkisan.gov.in',
    isActive: true,
    totalApplications: 125000
  },
  {
    title: 'Pradhan Mantri Awas Yojana',
    description: 'Housing for All scheme providing affordable housing to urban and rural poor.',
    organization: 'Ministry of Housing',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'housing',
    eligibility: 'EWS/LIG households without pucca house',
    benefits: 'Interest subsidy up to Rs. 2.67 lakh on home loans',
    deadline: new Date('2024-12-31'),
    state: 'All India',
    url: 'https://pmaymis.gov.in',
    isActive: true,
    totalApplications: 89000
  },
  {
    title: 'National Scholarship Portal',
    description: 'Single window for various scholarship schemes for students.',
    organization: 'Ministry of Education',
    ministry: 'Ministry of Education',
    category: 'education',
    eligibility: 'Students from SC/ST/OBC/Minority/General categories',
    benefits: 'Scholarship amount from Rs. 10,000 to Rs. 2 lakh per year',
    deadline: new Date('2024-10-31'),
    state: 'All India',
    url: 'https://scholarships.gov.in',
    isActive: true,
    totalApplications: 234000
  },
  {
    title: 'Ayushman Bharat Yojana',
    description: 'Worlds largest government-funded healthcare program covering 50 crore beneficiaries.',
    organization: 'National Health Authority',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'health',
    eligibility: 'Families identified in SECC 2011 database',
    benefits: 'Health coverage up to Rs. 5 lakh per family per year',
    deadline: new Date('2024-12-31'),
    state: 'All India',
    url: 'https://pmjay.gov.in',
    isActive: true,
    totalApplications: 456000
  },
  {
    title: 'Skill India Mission',
    description: 'National Skill Development Mission to train over 40 crore people in different skills.',
    organization: 'Ministry of Skill Development',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    category: 'skill-development',
    eligibility: 'Youth aged 15-45 years',
    benefits: 'Free skill training with certification and placement support',
    deadline: new Date('2024-12-31'),
    state: 'All India',
    url: 'https://skillindia.gov.in',
    isActive: true,
    totalApplications: 178000
  },
  {
    title: 'MUDRA Loan Scheme',
    description: 'Micro Units Development and Refinance Agency for non-corporate small business loans.',
    organization: 'SIDBI',
    ministry: 'Ministry of Finance',
    category: 'finance',
    eligibility: 'Small business owners, entrepreneurs, shopkeepers',
    benefits: 'Loans from Rs. 50,000 to Rs. 10 lakh at subsidized rates',
    deadline: new Date('2024-12-31'),
    state: 'All India',
    url: 'https://mudra.org.in',
    isActive: true,
    totalApplications: 312000
  }
]

const examsData = [
  {
    title: 'UPSC Civil Services Examination 2024',
    description: 'Civil Services (Preliminary) Examination for IAS, IPS, IFS and other central services.',
    organization: 'Union Public Service Commission',
    examType: 'upsc',
    eligibility: 'Graduate in any discipline from recognized university',
    applicationStart: new Date('2024-02-14'),
    applicationEnd: new Date('2024-03-05'),
    examDate: new Date('2024-05-26'),
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 1056,
    ageLimit: { min: 21, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://upsc.gov.in',
    isActive: true
  },
  {
    title: 'SSC CGL 2024',
    description: 'Combined Graduate Level Examination for Group B and C posts in various ministries.',
    organization: 'Staff Selection Commission',
    examType: 'ssc',
    eligibility: 'Graduate from recognized university',
    applicationStart: new Date('2024-06-11'),
    applicationEnd: new Date('2024-07-10'),
    examDate: new Date('2024-09-15'),
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 7500,
    ageLimit: { min: 18, max: 32 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ssc.gov.in',
    isActive: true
  },
  {
    title: 'IBPS PO 2024',
    description: 'Probationary Officer recruitment in participating public sector banks.',
    organization: 'Institute of Banking Personnel Selection',
    examType: 'banking',
    eligibility: 'Graduate in any discipline',
    applicationStart: new Date('2024-07-01'),
    applicationEnd: new Date('2024-07-21'),
    examDate: new Date('2024-10-19'),
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    totalPosts: 4872,
    ageLimit: { min: 20, max: 30 },
    qualification: 'Graduate',
    state: 'All India',
    url: 'https://ibps.in',
    isActive: true
  },
  {
    title: 'NDA & NA Examination (I) 2024',
    description: 'National Defence Academy and Naval Academy examination for Army, Navy, and Air Force.',
    organization: 'Union Public Service Commission',
    examType: 'defence',
    eligibility: '12th pass or appearing in Physics, Chemistry, and Mathematics',
    applicationStart: new Date('2024-12-20'),
    applicationEnd: new Date('2024-01-09'),
    examDate: new Date('2024-04-21'),
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    totalPosts: 400,
    ageLimit: { min: 16, max: 19 },
    qualification: '12th Pass',
    state: 'All India',
    url: 'https://upsc.gov.in',
    isActive: true
  },
  {
    title: 'RRB NTPC 2024',
    description: 'Non-Technical Popular Categories recruitment in Indian Railways.',
    organization: 'Railway Recruitment Board',
    examType: 'railway',
    eligibility: '12th pass or Graduate depending on post',
    applicationStart: new Date('2024-08-01'),
    applicationEnd: new Date('2024-08-30'),
    examDate: new Date('2024-12-15'),
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    totalPosts: 35000,
    ageLimit: { min: 18, max: 33 },
    qualification: '12th Pass / Graduate',
    state: 'All India',
    url: 'https://rrbcdg.gov.in',
    isActive: true
  },
  {
    title: 'State PSC Combined Exam 2024',
    description: 'State Public Service Commission combined examination for various state government posts.',
    organization: 'State Public Service Commission',
    examType: 'state',
    eligibility: 'Graduate from recognized university',
    applicationStart: new Date('2024-03-01'),
    applicationEnd: new Date('2024-03-31'),
    examDate: new Date('2024-06-20'),
    applicationFee: { general: 500, obc: 500, sc: 200, st: 200, ews: 500 },
    totalPosts: 2500,
    ageLimit: { min: 21, max: 38 },
    qualification: 'Graduate',
    state: 'Maharashtra',
    url: 'https://mpsc.gov.in',
    isActive: true
  }
]

const jobsData = [
  {
    title: 'SSC CGL - Assistant Section Officer',
    description: 'Assistant Section Officer in various Central Government Ministries and Departments.',
    organization: 'Staff Selection Commission',
    department: 'Central Secretariat Service',
    jobType: 'permanent',
    location: 'Delhi, Mumbai, Kolkata, Chennai',
    state: 'All India',
    eligibility: 'Graduate from recognized university with Computer Proficiency',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 44900, max: 142400 },
    totalPosts: 3600,
    applicationStart: new Date('2024-06-11'),
    applicationEnd: new Date('2024-07-10'),
    ageLimit: { min: 18, max: 30 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Tier-I Computer Exam, Tier-II Computer Exam, Document Verification',
    url: 'https://ssc.gov.in',
    isActive: true
  },
  {
    title: 'IBPS PO - Probationary Officer',
    description: 'Probationary Officer in participating public sector banks across India.',
    organization: 'Institute of Banking Personnel Selection',
    department: 'Public Sector Banks',
    jobType: 'permanent',
    location: 'Pan India',
    state: 'All India',
    eligibility: 'Graduate in any discipline from recognized University',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 36000, max: 63000 },
    totalPosts: 4872,
    applicationStart: new Date('2024-07-01'),
    applicationEnd: new Date('2024-07-21'),
    ageLimit: { min: 20, max: 30 },
    applicationFee: { general: 850, obc: 850, sc: 175, st: 175, ews: 850 },
    selectionProcess: 'Preliminary Exam, Mains Exam, Interview',
    url: 'https://ibps.in',
    isActive: true
  },
  {
    title: 'Indian Railways - RRB NTPC',
    description: 'Various Non-Technical Popular Categories posts in Indian Railways.',
    organization: 'Railway Recruitment Board',
    department: 'Indian Railways',
    jobType: 'permanent',
    location: 'All Zonal Railways',
    state: 'All India',
    eligibility: '12th Pass or Graduate depending on post',
    qualification: '12th Pass / Graduate',
    experience: 'Fresher',
    salaryRange: { min: 19900, max: 44900 },
    totalPosts: 35000,
    applicationStart: new Date('2024-08-01'),
    applicationEnd: new Date('2024-08-30'),
    ageLimit: { min: 18, max: 33 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 250 },
    selectionProcess: 'CBT Stage 1, CBT Stage 2, Skill Test/Document Verification',
    url: 'https://rrbcdg.gov.in',
    isActive: true
  },
  {
    title: 'UPSC Civil Services - IAS Officer',
    description: 'Indian Administrative Service officer positions across various state cadres.',
    organization: 'Union Public Service Commission',
    department: 'Indian Administrative Service',
    jobType: 'permanent',
    location: 'All India Cadre',
    state: 'All India',
    eligibility: 'Graduate in any discipline from recognized university',
    qualification: 'Graduate',
    experience: 'Fresher',
    salaryRange: { min: 56100, max: 250000 },
    totalPosts: 180,
    applicationStart: new Date('2024-02-14'),
    applicationEnd: new Date('2024-03-05'),
    ageLimit: { min: 21, max: 32 },
    applicationFee: { general: 100, obc: 100, sc: 0, st: 0, ews: 100 },
    selectionProcess: 'Prelims, Mains, Interview, Medical Examination',
    url: 'https://upsc.gov.in',
    isActive: true
  },
  {
    title: 'State Police Constable',
    description: 'Police Constable recruitment in State Police Department.',
    organization: 'State Police Recruitment Board',
    department: 'State Police Department',
    jobType: 'permanent',
    location: 'State-wide',
    state: 'Maharashtra',
    eligibility: '12th Pass from recognized board, Physical fitness required',
    qualification: '12th Pass',
    experience: 'Fresher',
    salaryRange: { min: 21700, max: 69100 },
    totalPosts: 12000,
    applicationStart: new Date('2024-09-01'),
    applicationEnd: new Date('2024-09-30'),
    ageLimit: { min: 18, max: 28 },
    applicationFee: { general: 500, obc: 500, sc: 250, st: 250, ews: 500 },
    selectionProcess: 'Written Exam, Physical Test, Medical Test, Document Verification',
    url: 'https://mahapolice.gov.in',
    isActive: true
  },
  {
    title: 'Defence - Agniveer (Army)',
    description: 'Short-term military service opportunity under Agnipath Scheme.',
    organization: 'Indian Army',
    department: 'Ministry of Defence',
    jobType: 'contract',
    location: 'All India',
    state: 'All India',
    eligibility: '10th/12th Pass, Physical and Medical Standards',
    qualification: '10th/12th Pass',
    experience: 'Fresher',
    salaryRange: { min: 30000, max: 40000 },
    totalPosts: 25000,
    applicationStart: new Date('2024-01-01'),
    applicationEnd: new Date('2024-02-15'),
    ageLimit: { min: 17, max: 23 },
    applicationFee: { general: 0, obc: 0, sc: 0, st: 0, ews: 0 },
    selectionProcess: 'Physical Fitness Test, Medical Examination, Written Exam',
    url: 'https://joinindianarmy.nic.in',
    isActive: true
  }
]

export async function GET() {
  try {
    await connectDB()

    // Clear existing data
    await Scheme.deleteMany({})
    await Exam.deleteMany({})
    await Job.deleteMany({})

    // Insert new data
    await Scheme.insertMany(schemesData)
    await Exam.insertMany(examsData)
    await Job.insertMany(jobsData)

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      counts: {
        schemes: schemesData.length,
        exams: examsData.length,
        jobs: jobsData.length
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
