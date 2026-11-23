'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  BookOpen,
  CheckCircle,
  Users,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function TutorDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalTuitionsPosted: 0,
    activeApprovedTuitions: 0,
    totalApplicantsReceived: 0,
    currentPlan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      setLoading(true);
      try {
        const res = await api.get('/tutor/stats', { token });
        if (res?.success && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load tutor stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Tutor Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome, {user?.name?.split(' ')[0] || 'Tutor'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your tuition postings, review student applications, and monitor performance.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Tuition</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Posted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Posted
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalTuitionsPosted}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All posted tuition listings</p>
        </div>

        {/* Card 2: Active / Approved */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active & Approved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {loading ? '...' : stats.activeApprovedTuitions}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Currently live on marketplace</p>
        </div>

        {/* Card 3: Total Applicants Received */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Applicants Received
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {loading ? '...' : stats.totalApplicantsReceived}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Students seeking tuition</p>
        </div>

        {/* Card 4: Current Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Plan
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 capitalize">
            {loading ? '...' : stats.currentPlan}
          </div>
          <div className="mt-1">
            {stats.currentPlan === 'pro' ? (
              <span className="text-[11px] font-bold text-emerald-600">Unlimited Postings</span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Max 2 Posts •{' '}
                <Link href="/pricing" className="text-emerald-600 font-bold hover:underline">
                  Go Pro ($15)
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Management Hub</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/tutor/post-tuition"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Post Tuition
                </h3>
                <p className="text-[11px] text-slate-500">Add a new tuition requirement</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  My Tuitions
                </h3>
                <p className="text-[11px] text-slate-500">Edit or review existing postings</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/tutor/applicants"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Applicants
                </h3>
                <p className="text-[11px] text-slate-500">Accept or reject student requests</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
