'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { RechargeModal } from '@/components/RechargeModal';
import { AuthModal } from '@/components/AuthModal';
import { Logo } from '@/components/Logo';
import {
  Wallet as WalletIcon,
  ChevronDown,
  Plus,
  Radio,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Clock,
  History,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    currentUser,
    isLoggedIn,
    wallet,
    openAuthModal,
    logout,
    isLoaded,
  } = usePlatform();

  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Logo href="/" size="md" />

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              /* When NOT Logged In: Show Login & Sign Up buttons (Larger text & prominent styling) */
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/register"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] shadow-sm transition cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              /* When Logged In: Show Wallet & User Dropdown */
              <div className="flex items-center gap-3">
                {/* Wallet Balance Pill */}
                <div className="hidden sm:flex items-center bg-slate-100/90 border border-slate-200 rounded-xl p-1 shadow-xs">
                  <Link
                    href="/dashboard/wallet"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white rounded-lg transition"
                  >
                    <WalletIcon className="w-4 h-4 text-slate-900" />
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-slate-600 leading-none">Available</span>
                      <span className="font-black text-slate-900 font-mono text-sm">
                        {!isLoaded ? (
                          <span className="inline-block w-12 h-3.5 bg-slate-200 animate-pulse rounded my-0.5" />
                        ) : (
                          `₹${wallet.availableBalance.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {isLoaded && wallet.heldBalance > 0 && (
                      <div className="hidden sm:flex flex-col text-left pl-2.5 border-l border-slate-300">
                        <span className="text-[10px] font-bold text-amber-700 leading-none">Held</span>
                        <span className="font-bold text-amber-800 font-mono text-xs">
                          ₹{wallet.heldBalance.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsRechargeOpen(true)}
                    className="ml-1 p-2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition flex items-center justify-center cursor-pointer shadow-xs font-bold"
                    title="Add Money"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Right Side User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs transition cursor-pointer shadow-xs"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${
                        isAdmin ? 'bg-purple-900' : 'bg-[#0f172a]'
                      } flex items-center justify-center font-bold text-white text-xs shadow-xs`}
                    >
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden sm:inline font-bold text-slate-800 max-w-[120px] truncate">
                      {currentUser.name || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {/* User Info Header */}
                      <div className="px-3 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate font-medium">{currentUser.email}</p>
                        <span
                          className={`inline-block mt-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isAdmin
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {currentUser.role}
                        </span>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <div className="py-1.5 space-y-0.5">
                        <Link
                          href="/dashboard/overview"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0f172a]" />
                          <span>Dashboard Overview</span>
                        </Link>
                        <Link
                          href="/dashboard/buy-number"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Radio className="w-4 h-4 text-[#0f172a]" />
                          <span>Buy Temporary Number</span>
                        </Link>
                        <Link
                          href="/dashboard/active-orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Active Orders</span>
                        </Link>
                        <Link
                          href="/dashboard/activations"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <History className="w-4 h-4 text-slate-700" />
                          <span>Order History</span>
                        </Link>
                        <Link
                          href="/dashboard/wallet"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <WalletIcon className="w-4 h-4 text-[#0f172a]" />
                          <span>Wallet & Ledger</span>
                        </Link>

                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Account Settings</span>
                        </Link>
                        <Link
                          href="/dashboard/support"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <HelpCircle className="w-4 h-4 text-teal-600" />
                          <span>Support Center</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Popups & Modals */}
      <AuthModal />
      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </>
  );
};
