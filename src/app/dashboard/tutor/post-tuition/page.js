'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { PlusCircle, Upload, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostTuitionPage() {
  const { token, plan } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    classLevel: 'Class 10',
    location: '',
    monthlyFee: '',
    daysPerWeek: '3',
    mode: 'in-person',
    requirements: '',
    bannerImage: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subjects = [
    'Mathematics',
    'Higher Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Bangla',
    'ICT',
    'Accounting',
  ];

  const classLevels = [
    'Class 8',
    'Class 9',
    'Class 10',
    'HSC 1st Year',
    'HSC 2nd Year',
    'O Level',
    'A Level',
  ];

  const modes = [
    { label: 'In-Person (Home)', value: 'in-person' },
    { label: 'Online', value: 'online' },
    { label: 'Hybrid', value: 'hybrid' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/image', uploadData, { token });
      if (res?.success && res?.url) {
        setFormData((prev) => ({ ...prev, bannerImage: res.url }));
        toast.success('Banner image uploaded!');
      } else {
        toast.error(res?.message || 'Failed to upload image.');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload error.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim() || !formData.location.trim() || !formData.monthlyFee) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const feeNumber = Number(formData.monthlyFee);
    if (isNaN(feeNumber) || feeNumber <= 0) {
      setErrorMessage('Please provide a valid monthly fee in BDT.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(
        '/tuitions',
        {
          title: formData.title.trim(),
          subject: formData.subject,
          classLevel: formData.classLevel,
          location: formData.location.trim(),
          monthlyFee: feeNumber,
          daysPerWeek: Number(formData.daysPerWeek) || 3,
          mode: formData.mode,
          requirements: formData.requirements.trim(),
          bannerImage: formData.bannerImage.trim(),
        },
        { token }
      );

      if (res?.success) {
        toast.success('Tuition posted successfully! Awaiting admin approval.');
        router.push('/dashboard/tutor/my-tuitions');
      } else {
        setErrorMessage(res?.message || 'Failed to post tuition.');
        toast.error(res?.message || 'Failed to post tuition.');
      }
    } catch (err) {
      const msg = err.message || 'Failed to post tuition.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a New Tuition</h1>
        <p className="text-xs text-slate-500 mt-1">
          Create an authentic tuition opportunity. New posts are reviewed by admins before appearing publicly.
        </p>

        {plan === 'free' && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800">
            <span>
              Free tutors can post up to <strong>2 tuitions</strong>.
            </span>
            <Link href="/pricing" className="font-bold underline text-amber-900">
              Upgrade to Pro for Unlimited
            </Link>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tuition Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Need Class 10 Higher Math & Physics Tutor in Dhanmondi"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class Level <span className="text-rose-500">*</span>
            </label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
            >
              {classLevels.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Dhanmondi, Dhaka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Remuneration (BDT) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="monthlyFee"
              required
              min={500}
              value={formData.monthlyFee}
              onChange={handleChange}
              placeholder="e.g. 6000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Days Per Week
            </label>
            <select
              name="daysPerWeek"
              value={formData.daysPerWeek}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="2">2 Days / Week</option>
              <option value="3">3 Days / Week</option>
              <option value="4">4 Days / Week</option>
              <option value="5">5 Days / Week</option>
              <option value="6">6 Days / Week</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teaching Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {modes.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, mode: m.value }))}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  formData.mode === m.value
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Requirements / Tutor Specifications
          </label>
          <textarea
            rows={4}
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Specify curriculum (Bangla Medium / English Version), background preference, specific topics, or expectations..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Optional Banner Image
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              name="bannerImage"
              value={formData.bannerImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <label className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shrink-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Tuition Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
