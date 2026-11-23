'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  BookOpen,
  FileText,
  PlusCircle,
  Users,
  ShieldCheck,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const { user, role, plan, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Strict route authentication & role protection
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      toast.error('Please sign in to access the dashboard.');
      router.push('/sign-in');
      return;
    }

    // Role-based route guard
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      toast.error('Admin access required.');
      router.push(role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student');
    } else if (pathname.startsWith('/dashboard/tutor') && role !== 'tutor') {
      toast.error('Tutor access required.');
      router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/student');
    } else if (pathname.startsWith('/dashboard/student') && role !== 'student') {
      toast.error('Student access required.');
      router.push(role === 'admin' ? '/dashboard/admin' : '/dashboard/tutor');
    }
  }, [loading, isAuthenticated, user, role, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully.');
      router.push('/sign-in');
    } catch {
      toast.error('Failed to log out.');
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  // Navigation items based strictly on verified user role
  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { label: 'Moderate Tuitions', href: '/dashboard/admin/tuitions', icon: BookOpen },
        { label: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
      ];
    }
    if (role === 'tutor') {
      return [
        { label: 'Overview', href: '/dashboard/tutor', icon: LayoutDashboard },
        { label: 'Post New Tuition', href: '/dashboard/tutor/post-tuition', icon: PlusCircle },
        { label: 'My Tuitions', href: '/dashboard/tutor/my-tuitions', icon: BookOpen },
        { label: 'Applicants', href: '/dashboard/tutor/applicants', icon: Users },
      ];
    }
    // Default Student role
    return [
      { label: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
      { label: 'My Applications', href: '/dashboard/student/my-applications', icon: FileText },
    ];
  };

  const navItems = getNavItems();

  const isLinkActive = (href) => {
    return pathname === href;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      {/* Mobile dashboard header with toggle */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{role} Dashboard</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 shrink-0 space-y-6`}
      >
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* User mini badge */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            {user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center border border-emerald-200">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-slate-500 capitalize">{role}</span>
                {plan === 'pro' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                    PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Navigation
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>

          {/* Account Links */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Settings
            </span>

            <Link
              href="/dashboard/profile"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
