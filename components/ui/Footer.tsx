'use client'

import Link from 'next/link'
import { Building2, GraduationCap, Briefcase, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-india-saffron to-india-green flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="font-bold text-xl">UGOVA</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Unified Government Opportunities & Verification App. Your one-stop platform for government schemes, exams, and jobs.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-india-saffron/20 text-india-saffron text-xs rounded">India</span>
              <span className="px-2 py-1 bg-india-green/20 text-india-green text-xs rounded">Govt</span>
              <span className="px-2 py-1 bg-india-blue/20 text-india-blue text-xs rounded">Youth</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/schemes" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link href="/exams" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4" />
                  Competitive Exams
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4" />
                  Government Jobs
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  India.gov.in
                </a>
              </li>
              <li>
                <a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  MyGov India
                </a>
              </li>
              <li>
                <a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  DigiLocker
                </a>
              </li>
              <li>
                <a href="https://www.umang.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  UMANG App
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-india-saffron" />
                support@ugova.gov.in
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-india-green" />
                1800-XXX-XXXX
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-india-blue mt-0.5" />
                <span>Ministry of Youth Affairs,<br />Government of India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 UGOVA. All rights reserved. Government of India Initiative.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/help" className="text-gray-500 hover:text-white text-sm">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
