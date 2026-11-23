'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  DollarSign,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function loadApplications() {
      setLoading(true);
      try {
        const res = await api.get('/my-applications', { token });
        if (res?.success && Array.isArray(res?.applications)) {
          setApplications(res.applications);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Failed to load student applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [token]);

  // Cancel pending application
  const handleCancel = async (appId) => {
    if (!window.confirm('Are you sure you want to cancel this application?')) return;

    setCancellingId(appId);
    try {
      const res = await api.delete(`/applications/${appId}`, { token });
      if (res?.success) {
        toast.success('Application cancelled successfully.');
        setApplications((prev) => prev.filter((a) => a._id !== appId));
      } else {
        toast.error(res?.message || 'Failed to cancel application.');
      }
    } catch (err) {
      toast.error(err.message || 'Error cancelling application.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accepted</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review the status of tuitions you have applied for.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find More Tuitions</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading your applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You haven&apos;t applied to any tuition posts yet. Explore our directory and connect with expert tutors.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <span>Browse Tuitions</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Tuition Title</th>
                  <th className="py-4 px-6">Tutor Email</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Preferred Schedule</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                      {app.tuitionTitle || 'Tuition Post'}
                      <div className="text-[10px] text-slate-400 font-normal">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 truncate max-w-[160px]">
                      {app.tutorEmail}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      ৳{Number(app.monthlyFee).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {app.preferredSchedule || 'Flexible'}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-6 text-right">
                      {app.status === 'pending' ? (
                        <button
                          type="button"
                          disabled={cancellingId === app._id}
                          onClick={() => handleCancel(app._id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{cancellingId === app._id ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
