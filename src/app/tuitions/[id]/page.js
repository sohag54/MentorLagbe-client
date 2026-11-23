'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

function TuitionDetailContent() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user, role, token, isAuthenticated } = useAuth();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application modal & form state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appForm, setAppForm] = useState({
    studentPhone: '',
    preferredSchedule: '',
    studentNote: '',
  });

  // Fetch tuition details
  useEffect(() => {
    if (!id) return;

    async function loadTuition() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/tuitions/${id}`);
        if (data?.success && data?.tuition) {
          setTuition(data.tuition);
        } else {
          setError('Tuition not found or no longer active.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load tuition details.');
      } finally {
        setLoading(false);
      }
    }

    loadTuition();
  }, [id]);

  const handleOpenModal = () => {
    setAppForm((prev) => ({
      ...prev,
      studentPhone: user?.phone || prev.studentPhone,
    }));
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (!appForm.studentPhone.trim()) {
      toast.error('Contact phone number is required to apply.');
      return;
    }

    setApplying(true);
    try {
      const res = await api.post(
        '/applications',
        {
          tuitionId: id,
          studentPhone: appForm.studentPhone.trim(),
          preferredSchedule: appForm.preferredSchedule.trim(),
          studentNote: appForm.studentNote.trim(),
        },
        { token }
      );

      if (res?.success) {
        toast.success('Your application was submitted successfully!');
        setApplyModalOpen(false);
      } else {
        toast.error(res?.message || 'Failed to submit application.');
      }
    } catch (err) {
      const msg = err.message || 'Failed to apply.';
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading tuition details...</p>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Tuition Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">{error || 'This tuition listing may have been unapproved or closed.'}</p>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Other Tuitions</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button */}
      <Link
        href="/tuitions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tuitions</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {tuition.subject}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                {tuition.mode || 'In-Person'}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                {tuition.classLevel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-4">
              {tuition.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 text-sm">
              <div className="flex items-center gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">Location:</strong> {tuition.location}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">Days:</strong> {tuition.daysPerWeek || 3} days per week
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">Class:</strong> {tuition.classLevel}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-900">Tutor:</strong> {tuition.tutorEmail}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-base font-bold text-slate-900 mb-2">Description & Requirements</h2>
              <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {tuition.requirements || tuition.description || 'No detailed requirements provided by the poster.'}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Card: Salary & Application Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Remuneration
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1 mb-4">
              ৳{Number(tuition.monthlyFee).toLocaleString()}
              <span className="text-sm font-normal text-slate-500"> / month</span>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              {isAuthenticated && role === 'student' ? (
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply for this Tuition</span>
                </button>
              ) : isAuthenticated && role !== 'student' ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  You are logged in as a <strong>{role}</strong>. Only registered Students can submit applications for tuition posts.
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/sign-in"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Apply</span>
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    Students must sign in to submit tuition applications.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified posting with transparent fee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero middleman commission charged</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply for Tuition</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tuition.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={appForm.studentPhone}
                  onChange={(e) =>
                    setAppForm((p) => ({ ...p, studentPhone: e.target.value }))
                  }
                  placeholder="01711000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Schedule
                </label>
                <input
                  type="text"
                  value={appForm.preferredSchedule}
                  onChange={(e) =>
                    setAppForm((p) => ({ ...p, preferredSchedule: e.target.value }))
                  }
                  placeholder="e.g., Mon, Wed, Fri 5:00 PM - 6:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note to Tutor
                </label>
                <textarea
                  rows={3}
                  value={appForm.studentNote}
                  onChange={(e) =>
                    setAppForm((p) => ({ ...p, studentNote: e.target.value }))
                  }
                  placeholder="Mention your learning goals, current syllabus, or specific topics you need help with..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {applying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TuitionDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading tuition details...
        </div>
      }
    >
      <TuitionDetailContent />
    </Suspense>
  );
}
