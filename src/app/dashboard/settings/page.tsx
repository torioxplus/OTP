'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import {
  User,
  Bell,
  Save,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, logout } = usePlatform();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Danger Zone deletion state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirmInput.trim().toUpperCase() !== 'CONFIRM') return;
    setIsDeleting(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('otp_user_token');
        localStorage.removeItem('otp_user_role');
        localStorage.removeItem('otp_user');
      }
      logout();
      router.push('/');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Manage your personal details, notification preferences, and account security.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Details */}
      <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
          <User className="w-5 h-5 text-slate-900" />
          <span>Profile Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={currentUser.name}
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#0f172a] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1.5">Email Address</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                defaultValue={currentUser.email}
                disabled
                className="w-full px-4 py-2.5 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
              />
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs whitespace-nowrap">
                Verified
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1.5">Phone Number</label>
            <input
              type="tel"
              defaultValue={currentUser.phone || '+91 98765 43210'}
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#0f172a] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1.5">Account Role</label>
            <input
              type="text"
              defaultValue={currentUser.role.toUpperCase()}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-600 font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Notifications & Audio */}
      <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
          <Bell className="w-5 h-5 text-slate-900" />
          <span>Notification Preferences</span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Sound Alert on Incoming OTP</span>
              <span className="text-xs text-slate-500 font-medium">
                Play soft chime sound when an SMS verification code is detected
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 border-slate-300 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block text-sm">Email Alerts on Wallet Deposit</span>
              <span className="text-xs text-slate-500 font-medium">
                Receive transactional receipt whenever your wallet balance is credited
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 border-slate-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm transition flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* DANGER SPACE: Permanently Delete Account (High-Contrast Clean White & Soft Rose) */}
      <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Danger Space: Permanent Account Deletion</span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          Permanently delete your account, active temporary numbers, order history, and wallet ledger
          balances. Once confirmed, this action cannot be reversed and your data is permanently removed.
        </p>

        {!isDeleteConfirmOpen ? (
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account Permanently</span>
          </button>
        ) : (
          <div className="p-5 rounded-xl bg-white border-2 border-rose-300 space-y-3.5 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Are you absolutely certain?</span>
                <span className="text-xs text-slate-600 font-medium">
                  Please type{' '}
                  <code className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-mono font-bold">
                    CONFIRM
                  </code>{' '}
                  below to confirm permanent deletion.
                </span>
              </div>
            </div>

            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type CONFIRM to proceed..."
              className="w-full px-4 py-2.5 bg-white border-2 border-rose-300 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-rose-600"
              autoFocus
            />

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmInput.trim().toUpperCase() !== 'CONFIRM' || isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting Everything...' : 'Yes, Permanently Delete'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setConfirmInput('');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer border border-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
