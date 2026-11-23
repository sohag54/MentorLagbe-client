'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { role, refreshAuth } = useAuth();

  useEffect(() => {
    // Refresh user session so Pro plan is immediately reflected in UI state
    refreshAuth();
  }, [refreshAuth]);

  const dashboardHref =
    role === 'tutor'
      ? '/dashboard/tutor'
      : role === 'admin'
      ? '/dashboard/admin'
      : '/dashboard/student';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRO PLAN ACTIVATED</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Subscription Successful!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Thank you for subscribing to MentorLagbe Pro. Your payment was securely verified and your account has been upgraded.
          </p>
        </div>

        {sessionId && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono break-all">
            Session ID: {sessionId}
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={dashboardHref}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </Link>
          <Link
            href="/tuitions"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Browse Tuitions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-slate-500">Verifying payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

