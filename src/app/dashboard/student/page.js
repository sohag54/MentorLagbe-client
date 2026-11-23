'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalAppliedTuitions: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    currentPlan: 'free',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      setLoading(true);
      try {
        const res = await api.get('/student/stats', { token });
        if (res?.success && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load student stats:', err);
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
            Student Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your applied tuitions, view acceptance statuses, and discover new tutors.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Tuitions</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Applied */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Applied
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalAppliedTuitions}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All applications submitted</p>
        </div>

        {/* Card 2: Accepted Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Accepted
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {loading ? '...' : stats.acceptedApplications}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Approved by tutors</p>
        </div>

        {/* Card 3: Pending Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {loading ? '...' : stats.pendingApplications}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting tutor review</p>
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
              <span className="text-[11px] font-bold text-emerald-600">Active Pro Member</span>
            ) : (
              <Link
                href="/pricing"
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/student/my-applications"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  My Applications
                </h3>
                <p className="text-xs text-slate-500">Track and manage your submitted applications</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/tuitions"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Find More Tuitions
                </h3>
                <p className="text-xs text-slate-500">Explore authentic tuition posts across subjects</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
