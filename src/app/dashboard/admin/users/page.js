'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  Shield,
  Search,
  CheckCircle,
  Save,
  Mail,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { token });
      if (res?.success && Array.isArray(res?.users)) {
        setUsers(res.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await api.get('/admin/users', { token });
        if (isMounted) {
          setUsers(res?.success && Array.isArray(res?.users) ? res.users : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load admin users:', err);
          setUsers([]);
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

  const handleRoleChange = async (userId, targetUserEmail, newRole) => {
    // Guard: Prevent admin self-demotion
    if (targetUserEmail === currentUser?.email && newRole !== 'admin') {
      toast.error('Admins cannot demote their own account.');
      return;
    }

    setUpdatingId(userId);
    try {
      const res = await api.patch(
        `/admin/users/${userId}/role`,
        { role: newRole },
        { token }
      );

      if (res?.success) {
        toast.success(`Role updated to ${newRole}!`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(res?.message || 'Failed to update user role.');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating user role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review registered platform members, check subscription tiers, and update user roles.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading user registry...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Users Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Plan Tier</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={u.image}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {(u.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{u.name || 'User'}</div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : u.role === 'tutor'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          u.plan === 'pro'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.plan || 'free'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        disabled={updatingId === u._id}
                        value={u.role || 'student'}
                        onChange={(e) =>
                          handleRoleChange(u._id, u.email, e.target.value)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
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
