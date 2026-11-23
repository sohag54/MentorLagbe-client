'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Check,
  Sparkles,
  Zap,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const { user, role, plan, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast('Please sign in to subscribe to the Pro plan.', { icon: '🔒' });
      router.push('/sign-in');
      return;
    }

    if (plan === 'pro') {
      toast.success('You are already subscribed to the Pro plan!');
      return;
    }

    if (role === 'admin') {
      toast.error('Admin accounts do not require a subscription.');
      return;
    }

    setSubscribing(true);
    try {
      // Call backend to create real Stripe Checkout Session
      const res = await api.post(
        '/payment/create-checkout-session',
        {},
        { token }
      );

      if (res?.success && res?.url) {
        toast.loading('Redirecting to Stripe Checkout...');
        window.location.href = res.url;
      } else {
        toast.error(res?.message || 'Could not initiate checkout session.');
        setSubscribing(false);
      }
    } catch (err) {
      toast.error(err.message || 'Payment initiation failed.');
      setSubscribing(false);
    }
  };

  const isTutor = role === 'tutor';
  const price = isTutor ? '$15' : '$10';
  const roleName = isTutor ? 'Tutor' : 'Student';

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Supercharge Your MentorLagbe Journey
        </h1>

        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Start for free or upgrade to Pro for unlimited postings, priority placement, and verified badges.
        </p>

        {isAuthenticated && (
          <div className="inline-block mt-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Logged in as <strong className="capitalize">{role}</strong> • Current Plan: <strong className="uppercase text-emerald-700">{plan}</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Free Plan Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Starter
              </span>
              {plan === 'free' && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  Current Plan
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Free Tier</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Ideal for getting started and exploring opportunities.
            </p>

            <div className="text-4xl font-black text-slate-900 mb-6">
              $0
              <span className="text-sm font-normal text-slate-500"> / forever</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Browse all public approved tuitions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isTutor ? 'Post up to 2 active tuitions' : 'Direct tuition applications'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Manage applications & responses</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <span className="w-4 h-4 text-center">✕</span>
                <span>Verified Pro Member badge</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <span className="w-4 h-4 text-center">✕</span>
                <span>Priority applicant matching</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs cursor-default"
            >
              Included by Default
            </button>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className="bg-slate-900 rounded-3xl border-2 border-emerald-500 p-8 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500 text-slate-900">
              POPULAR
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {roleName} Pro
              </span>
            </div>

            <h2 className="text-2xl font-bold">Pro Subscription</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Unlock unlimited potential with premium platform privileges.
            </p>

            <div className="text-4xl font-black text-emerald-400 mb-6">
              {price}
              <span className="text-sm font-normal text-slate-400"> / month</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">
                  {isTutor ? 'Unlimited tuition postings' : 'Priority application status'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Pro profile badge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct applicant notification alerts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Premium customer support</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant automated Stripe billing</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800">
            {plan === 'pro' ? (
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/50 cursor-default"
              >
                ✓ Current Active Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {subscribing ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe via Stripe ({price}/mo)</span>
                  </>
                )}
              </button>
            )}
            <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure 256-bit encrypted checkout via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

