'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTuitionsPage() {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tuitions', { token });
      if (res?.success && Array.isArray(res?.tuitions)) {
        setTuitions(res.tuitions);
      } else {
        setTuitions([]);
      }
    } catch (err) {
      console.error('Failed to load admin tuitions:', err);
      setTuitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await api.get('/admin/tuitions', { token });
        if (isMounted) {
          setTuitions(res?.success && Array.isArray(res?.tuitions) ? res.tuitions : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load admin tuitions:', err);
          setTuitions([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleUpdateStatus = async (tuitionId, newStatus) => {
    setUpdatingId(tuitionId);
    try {
      const res = await api.patch(
        `/admin/tuitions/${tuitionId}/status`,
        { approvalStatus: newStatus },
        { token }
      );

      if (res?.success) {
        toast.success(`Tuition status updated to ${newStatus}!`);
        setTuitions((prev) =>
          prev.map((t) =>
            t._id === tuitionId ? { ...t, approvalStatus: newStatus } : t
          )
        );
      } else {
        toast.error(res?.message || 'Failed to update tuition status.');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Pending</span>
      </span>
    );
  };

  const filteredTuitions = tuitions.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.approvalStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tuition Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review tutor listings and approve or reject postings to ensure high quality marketplace content.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterStatus === s
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading tuitions for moderation...</p>
        </div>
      ) : filteredTuitions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Tuitions Found</h3>
          <p className="text-xs text-slate-500">
            No tuition postings match the &ldquo;{filterStatus}&rdquo; status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Tuition Title</th>
                  <th className="py-4 px-6">Tutor & Location</th>
                  <th className="py-4 px-6">Subject & Class</th>
                  <th className="py-4 px-6">Remuneration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {t.mode || 'in-person'} • {t.daysPerWeek || 3} days/wk
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-medium truncate max-w-[150px]">
                        {t.tutorEmail}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{t.location}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{t.subject}</div>
                      <div className="text-[10px] text-slate-500">{t.classLevel}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ৳{Number(t.monthlyFee).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(t.approvalStatus)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {t.approvalStatus !== 'approved' && (
                        <button
                          type="button"
                          disabled={updatingId === t._id}
                          onClick={() => handleUpdateStatus(t._id, 'approved')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {t.approvalStatus !== 'rejected' && (
                        <button
                          type="button"
                          disabled={updatingId === t._id}
                          onClick={() => handleUpdateStatus(t._id, 'rejected')}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
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
