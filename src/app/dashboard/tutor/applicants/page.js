'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TutorApplicantsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tutor/applications', { token });
      if (res?.success && Array.isArray(res?.applications)) {
        setApplications(res.applications);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Failed to load tutor applicants:', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await api.get('/tutor/applications', { token });
        if (isMounted) {
          setApplications(res?.success && Array.isArray(res?.applications) ? res.applications : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load tutor applicants:', err);
          setApplications([]);
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

  const handleUpdateStatus = async (appId, newStatus) => {
    setProcessingId(appId);
    try {
      const res = await api.patch(
        `/applications/${appId}/status`,
        { status: newStatus },
        { token }
      );

      if (res?.success) {
        toast.success(`Application marked as ${newStatus}!`);
        // Update status locally
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      } else {
        toast.error(res?.message || 'Failed to update application status.');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating application.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Accepted</span>
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
        <span>Pending Review</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Applicant Requests</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review student applications for your posted tuitions. Accept or reject requests directly.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading student applicants...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Applicants Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When students apply for your tuition listings, their applications and contact details will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Student Information</th>
                  <th className="py-4 px-6">Tuition Post</th>
                  <th className="py-4 px-6">Schedule Preference</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{app.studentName || 'Student'}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{app.studentEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span className="font-semibold text-emerald-700">{app.studentPhone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {app.tuitionTitle || 'Tuition Post'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {app.subject} • ৳{Number(app.monthlyFee).toLocaleString()}/mo
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-slate-700">{app.preferredSchedule || 'Flexible'}</div>
                      {app.studentNote && (
                        <div className="text-[10px] text-slate-500 italic mt-1 line-clamp-2">
                          &ldquo;{app.studentNote}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            disabled={processingId === app._id}
                            onClick={() => handleUpdateStatus(app._id, 'accepted')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            disabled={processingId === app._id}
                            onClick={() => handleUpdateStatus(app._id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Decided</span>
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
