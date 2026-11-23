import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Mentor<span className="text-emerald-400">Lagbe</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier tuition marketplace in Bangladesh, empowering students to find top tutors and enabling tutors to grow their careers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tuitions" className="hover:text-emerald-400 transition-colors">
                  Find Tuitions
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-emerald-400 transition-colors">
                  Join as Tutor
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-emerald-400 transition-colors">
                  Join as Student
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tuition Cities */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Locations
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Dhaka (Dhanmondi, Mirpur, Gulshan)</li>
              <li>Chittagong (GEC, Panchlaish)</li>
              <li>Sylhet (Zindabazar, Amberkhana)</li>
              <li>Rajshahi & Online across Bangladesh</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Contact & Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@mentorlagbe.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+880 1711-000000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Assignment 9 with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
