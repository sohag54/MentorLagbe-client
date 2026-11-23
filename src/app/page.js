'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  GraduationCap,
  Search,
  BookOpen,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const [featuredTuitions, setFeaturedTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadTuitions() {
      try {
        const data = await api.get('/tuitions');
        if (data?.success && Array.isArray(data?.tuitions)) {
          // Take first 6 tuitions for homepage preview
          setFeaturedTuitions(data.tuitions.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured tuitions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTuitions();
  }, []);

  const categories = [
    { name: 'Mathematics', count: 'Higher Math & General Math', icon: '📐' },
    { name: 'Physics', count: 'Mechanics, Optics & Modern Physics', icon: '⚡' },
    { name: 'Chemistry', count: 'Organic & Inorganic Chemistry', icon: '🧪' },
    { name: 'English', count: 'Grammar, Spoken & Literature', icon: '📚' },
    { name: 'ICT & Coding', count: 'C, Python, HTML & Database', icon: '💻' },
    { name: 'Biology', count: 'Botany & Zoology Modules', icon: '🧬' },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>#1 Tuition Marketplace in Bangladesh</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Connect with Trusted Tutors, <br />
            <span className="text-emerald-600">Excel in Your Studies</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            MentorLagbe bridges the gap between passionate students and verified tutors across Dhaka, Chittagong, Sylhet, and online.
          </p>

          {/* Quick Search Box */}
          <div className="max-w-2xl mx-auto bg-white p-2.5 rounded-2xl shadow-md border border-slate-200 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject (e.g., Physics, Math, English)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <Link
              href={searchTerm ? `/tuitions?search=${encodeURIComponent(searchTerm)}` : '/tuitions'}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Search Tuitions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> 100% Admin Verified Tuitions
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Direct Tutor Contact
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Secure Stripe Pro Subscriptions
            </span>
          </div>
        </div>
      </section>

      {/* 2. Featured Tuitions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Latest Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Tuitions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Recently approved tuition requests from students across Bangladesh.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group"
          >
            <span>View All Tuitions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : featuredTuitions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No Tuitions Available</h3>
            <p className="text-sm text-slate-500 mt-1">Check back soon for newly posted tuition listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTuitions.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {t.subject}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {t.mode || 'In-Person'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
                    {t.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.classLevel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.daysPerWeek || 3} Days/Week</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Salary</span>
                    <div className="text-base font-black text-slate-900">
                      ৳{Number(t.monthlyFee).toLocaleString()}
                      <span className="text-xs text-slate-500 font-normal">/mo</span>
                    </div>
                  </div>

                  <Link
                    href={`/tuitions/${t._id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Popular Subjects & Categories Grid */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Browse by Subject
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Tuition Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find specialized mentors across core subjects from high school to university.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/tuitions?subject=${encodeURIComponent(cat.name)}`}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-2xl flex items-center justify-center shrink-0 transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How MentorLagbe Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Getting started takes less than 2 minutes whether you are learning or teaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Search & Find</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Explore tuition posts by subject, class level, mode, and salary budget across Bangladesh.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Apply Directly</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Students submit applications directly with preferred schedules. Tutors review and accept.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upgrade & Connect</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Subscribe to Pro for unlimited posts and priority bookings powered by secure Stripe payments.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Statistics Counter */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400">1,200+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Active Students</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400">450+</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Expert Tutors</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400">98%</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-400">64</div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Districts Covered</div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Success Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Loved by Students & Tutors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              &ldquo;Found an excellent BUET tutor for Higher Math within two days. MentorLagbe made the process so transparent.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Tanvir Hossain</p>
              <p className="text-[10px] text-slate-500">HSC Student, Dhaka</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              &ldquo;As a tutor, upgrading to the Pro plan gave me unlimited posts and serious applicants. Highly recommended!&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Farhana Yasmin</p>
              <p className="text-[10px] text-slate-500">Physics Tutor, Chittagong</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              &ldquo;The best part is no hidden agent commission fees. Students and tutors connect directly with clear terms.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Mahmudul Hasan</p>
              <p className="text-[10px] text-slate-500">English Medium Student, Sylhet</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="bg-emerald-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Academic Journey?
          </h2>
          <p className="text-emerald-100 text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of students and tutors today on Bangladesh&apos;s most reliable tuition marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-sm hover:bg-emerald-50 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              href="/tuitions"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-emerald-400 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
            >
              Browse Tuitions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
