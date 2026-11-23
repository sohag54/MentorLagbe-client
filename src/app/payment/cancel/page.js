import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout Cancelled
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Your Stripe checkout session was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

