'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  CreditCard,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalStripeRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      setLoading(true);
      try {
        const res = await api.get('/admin/stats', { token });
        if (res?.success && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
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
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Admin Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global metrics, tuition moderation status, and Stripe platform subscription revenue.
          </p>
        </div>

        <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-800">
          Superadmin Mode
        </div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : stats.totalUsers}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Registered platform members</p>
        </div>

        {/* Card 2: Total Tutors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Tutors
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {loading ? '...' : stats.totalTutors}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Approved & registered tutors</p>
        </div>

        {/* Card 3: Pending Tuitions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {loading ? '...' : stats.pendingTuitions}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Requiring admin approval</p>
        </div>

        {/* Card 4: Approved Tuitions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {loading ? '...' : stats.approvedTuitions}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Live active marketplace tuitions</p>
        </div>

        {/* Card 5: Total Stripe Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Stripe Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">
            ${loading ? '...' : Number(stats.totalStripeRevenue).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Paid Pro plan subscriptions</p>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Administration Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Manage Users
                </h3>
                <p className="text-[11px] text-slate-500">Update roles and manage permissions</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/admin/tuitions"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Moderate Tuitions
                </h3>
                <p className="text-[11px] text-slate-500">Approve or reject new listings</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Transactions
                </h3>
                <p className="text-[11px] text-slate-500">View Stripe subscription logs</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
