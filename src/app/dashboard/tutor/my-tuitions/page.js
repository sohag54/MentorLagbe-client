'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  X,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyTuitionsPage() {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTuition, setEditingTuition] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/my-tuitions', { token });
      if (res?.success && Array.isArray(res?.tuitions)) {
        setTuitions(res.tuitions);
      } else {
        setTuitions([]);
      }
    } catch (err) {
      console.error('Failed to load my tuitions:', err);
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
        const res = await api.get('/my-tuitions', { token });
        if (isMounted) {
          setTuitions(res?.success && Array.isArray(res?.tuitions) ? res.tuitions : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load my tuitions:', err);
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

  const handleOpenEdit = (t) => {
    setEditingTuition({
      _id: t._id,
      title: t.title || '',
      monthlyFee: t.monthlyFee || '',
      location: t.location || '',
      daysPerWeek: t.daysPerWeek || 3,
      mode: t.mode || 'in-person',
      requirements: t.requirements || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTuition) return;

    setSavingEdit(true);
    try {
      const res = await api.patch(
        `/tuitions/${editingTuition._id}`,
        {
          title: editingTuition.title.trim(),
          monthlyFee: Number(editingTuition.monthlyFee),
          location: editingTuition.location.trim(),
          daysPerWeek: Number(editingTuition.daysPerWeek),
          mode: editingTuition.mode,
          requirements: editingTuition.requirements.trim(),
        },
        { token }
      );

      if (res?.success) {
        toast.success('Tuition updated successfully!');
        setEditModalOpen(false);
        fetchTuitions();
      } else {
        toast.error(res?.message || 'Failed to update tuition.');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating tuition.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tuition posting?')) return;

    setDeletingId(id);
    try {
      const res = await api.delete(`/tuitions/${id}`, { token });
      if (res?.success) {
        toast.success('Tuition post deleted successfully.');
        setTuitions((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error(res?.message || 'Failed to delete tuition.');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting tuition.');
    } finally {
      setDeletingId(null);
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
        <span>Pending Review</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Posted Tuitions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, edit, or remove your posted tuition opportunities.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Tuition</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading your tuition listings...</p>
        </div>
      ) : tuitions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No Tuitions Posted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Start posting tuitions to connect with eager students looking for your expertise.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Post</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Tuition Details</th>
                  <th className="py-4 px-6">Subject & Class</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Remuneration</th>
                  <th className="py-4 px-6">Approval Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tuitions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {t.mode || 'in-person'} • {t.daysPerWeek || 3} days/wk
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{t.subject}</div>
                      <div className="text-[10px] text-slate-500">{t.classLevel}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-[140px] truncate">
                      {t.location}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ৳{Number(t.monthlyFee).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(t.approvalStatus)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === t._id}
                        onClick={() => handleDelete(t._id)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{deletingId === t._id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingTuition && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Tuition Post</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuition Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTuition.title}
                  onChange={(e) =>
                    setEditingTuition((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Fee (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingTuition.monthlyFee}
                    onChange={(e) =>
                      setEditingTuition((p) => ({ ...p, monthlyFee: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTuition.location}
                    onChange={(e) =>
                      setEditingTuition((p) => ({ ...p, location: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Days Per Week
                  </label>
                  <select
                    value={editingTuition.daysPerWeek}
                    onChange={(e) =>
                      setEditingTuition((p) => ({ ...p, daysPerWeek: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="2">2 Days/Week</option>
                    <option value="3">3 Days/Week</option>
                    <option value="4">4 Days/Week</option>
                    <option value="5">5 Days/Week</option>
                    <option value="6">6 Days/Week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teaching Mode
                  </label>
                  <select
                    value={editingTuition.mode}
                    onChange={(e) =>
                      setEditingTuition((p) => ({ ...p, mode: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requirements
                </label>
                <textarea
                  rows={3}
                  value={editingTuition.requirements}
                  onChange={(e) =>
                    setEditingTuition((p) => ({ ...p, requirements: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  {savingEdit ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
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
