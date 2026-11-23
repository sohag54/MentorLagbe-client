'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  CheckCircle,
  Save,
  Shield,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, token, isAuthenticated, loading: authLoading, updateUserData } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    image: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please sign in to view your profile.');
      router.push('/sign-in');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load latest user profile from GET /api/users/profile
  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      setInitialLoading(true);
      try {
        const res = await api.get('/users/profile', { token });
        if (res?.success && res?.data) {
          const d = res.data;
          setFormData({
            name: d.name || '',
            phone: d.phone || '',
            bio: d.bio || '',
            image: d.image || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        // Fall back to AuthContext user object
        if (user) {
          setFormData({
            name: user.name || '',
            phone: user.phone || '',
            bio: user.bio || '',
            image: user.image || '',
          });
        }
      } finally {
        setInitialLoading(false);
      }
    }

    fetchProfile();
  }, [token, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image to backend POST /api/upload/image (ImgBB)
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/image', uploadData, { token });
      if (res?.success && res?.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(res?.message || 'Failed to upload image.');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch(
        '/users/profile',
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
          image: formData.image.trim(),
        },
        { token }
      );

      if (res?.success && res?.data) {
        // Update local memory user in AuthContext
        updateUserData({
          name: res.data.name,
          phone: res.data.phone,
          bio: res.data.bio,
          image: res.data.image,
        });

        toast.success('Profile updated successfully!');
      } else {
        toast.error(res?.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information, profile photo, and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card & Avatar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
            <div className="relative inline-block mb-4">
              {formData.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={formData.image}
                  alt={formData.name || 'User'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 mx-auto shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-800 font-black text-3xl flex items-center justify-center mx-auto border-2 border-emerald-200">
                  {(formData.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              {user?.plan === 'pro' && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-0.5 shadow-xs">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>PRO</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {formData.name || 'User Name'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                <Shield className="w-3 h-3 mr-1 text-slate-500" />
                {user?.role || 'student'}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user?.plan || 'free'}
              </span>
            </div>

            {/* Image upload button */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <label className="block w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <span className="flex items-center justify-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                </span>
              </label>
              <p className="text-[10px] text-slate-400 mt-1.5">
                PNG, JPG or WEBP up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(Read-only)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01711000000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio / Academic Background
              </label>
              <textarea
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your educational qualifications, tutoring experience, or learning goals..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Image URL <span className="text-slate-400 font-normal">(Optional direct URL)</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                {saving ? (
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
    </div>
  );
}

