'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, role, plan, isAuthenticated, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out.');
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push('/sign-in');
    } catch {
      toast.error('Failed to logout.');
    }
  };

  const getDashboardHref = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'tutor') return '/dashboard/tutor';
    return '/dashboard/student';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tuitions', href: '/tuitions' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Mentor<span className="text-emerald-600">Lagbe</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Tuition Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  {user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center text-sm">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left pr-1">
                    <div className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
                      {user.name?.split(' ')[0] || 'User'}
                      {plan === 'pro' && (
                        <span className="inline-flex items-center px-1 py-0.2 text-[10px] font-bold text-amber-700 bg-amber-100 rounded">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" /> PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize leading-none">
                      {role || 'student'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardHref()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    {role === 'admin' && (
                      <div className="px-4 py-1.5 flex items-center gap-1.5 text-xs text-indigo-600 font-medium bg-indigo-50/50">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Access
                      </div>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {user.name}
                      {plan === 'pro' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{role}</div>
                  </div>
                </div>

                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
