'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { RechargeModal } from '@/components/RechargeModal';
import { OtpCountdownTimer } from '@/components/OtpCountdownTimer';
import { Logo } from '@/components/Logo';
import {
  Zap,
  LayoutDashboard,
  Clock,
  History,
  Wallet,
  FileText,
  Settings,
  Radio,
  Plus,
  ArrowRight,
  PanelLeft,
  X,
  LogOut,
  User as UserIcon,
  Shield,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    wallet,
    activeOrder,
    logout,
    isLoaded,
    isLoggedIn,
  } = usePlatform();

  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBottomUserMenuOpen, setIsBottomUserMenuOpen] = useState(false);

  // If not logged in, redirect away from protected dashboard
  React.useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoaded, isLoggedIn, router]);

  // Prevent flash: Never render dashboard UI if user is not loaded or not logged in
  if (!isLoaded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#0f172a] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  // Sidebar navigation sections
  const navSections = [
    {
      title: 'CORE SERVICES',
      items: [
        {
          label: 'Overview',
          href: '/dashboard/overview',
          icon: LayoutDashboard,
        },
        {
          label: 'Buy Number',
          href: '/dashboard/buy-number',
          icon: Radio,
          badge: 'Instant',
          badgeStyle: 'bg-blue-100 text-blue-800 font-bold',
        },
        {
          label: 'Active Orders',
          href: '/dashboard/active-orders',
          icon: Clock,
          badge: activeOrder ? '1 Waiting' : undefined,
          badgeStyle: 'bg-amber-100 text-amber-800 font-bold animate-pulse',
        },
        {
          label: 'Order History',
          href: '/dashboard/activations',
          icon: History,
        },
      ],
    },
    {
      title: 'FINANCES & BILLING',
      items: [
        {
          label: 'Wallet Overview',
          href: '/dashboard/wallet',
          icon: Wallet,
        },
        {
          label: 'Financial Ledger',
          href: '/dashboard/wallet/transactions',
          icon: FileText,
        },
      ],
    },
    {
      title: 'HELP & ACCOUNT',
      items: [
        {
          label: 'Support Desk',
          href: '/dashboard/support',
          icon: HelpCircle,
        },
        {
          label: 'Settings',
          href: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleAddFundsClick = () => {
    setIsRechargeOpen(true);
    if (!pathname?.startsWith('/dashboard/wallet')) {
      router.push('/dashboard/wallet');
    }
  };

  // Reusable Left Sidebar Content (Clean Light Mode)
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* 1. Sidebar Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <Logo href="/" size="sm" />

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-850 hover:bg-slate-100 transition cursor-pointer"
          title="Close Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Embedded Wallet Card in Sidebar */}
      <div className="p-3.5 mx-3 mt-4 mb-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
            <Wallet className="w-3.5 h-3.5 text-slate-900" />
            <span>Available Balance</span>
          </div>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
            INR
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          {!isLoaded ? (
            <div className="h-6 w-24 bg-slate-200 animate-pulse rounded my-0.5" />
          ) : (
            <>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                ₹{wallet.availableBalance.toFixed(2)}
              </span>
              {wallet.heldBalance > 0 && (
                <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  ₹{wallet.heldBalance.toFixed(2)} held
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddFundsClick}
          className="w-full py-2.5 px-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* 3. Navigation Menu Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-5 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <span className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {section.title}
            </span>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = (() => {
                  if (pathname === item.href) return true;
                  if (item.href === '/dashboard/buy-number') {
                    if (pathname === '/dashboard' || pathname === '/dashboard/buy-number') return true;
                  }
                  if (item.href === '/dashboard/wallet') {
                    return (
                      Boolean(pathname?.startsWith('/dashboard/wallet')) &&
                      !pathname?.startsWith('/dashboard/wallet/transactions')
                    );
                  }
                  if (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/')) {
                    return true;
                  }
                  return false;
                })();

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-[#0f172a] text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4.5 h-4.5 transition-colors ${
                          isActive
                            ? 'text-white stroke-[2.3]'
                            : 'text-slate-500 group-hover:text-slate-900'
                        }`}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : item.badgeStyle
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Sidebar Bottom User Section */}
      <div className="p-3 border-t border-slate-200 bg-white relative">
        {/* Dropdown Menu (Opens Upwards) */}
        {isBottomUserMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsBottomUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </Link>

            <Link
              href="/dashboard/support"
              onClick={() => setIsBottomUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Support Desk</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsBottomUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl transition"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Admin Console</span>
              </Link>
            )}

            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsBottomUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* User Pill Button */}
        <button
          type="button"
          onClick={() => setIsBottomUserMenuOpen(!isBottomUserMenuOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-lg ${
                isAdmin ? 'bg-purple-600' : 'bg-blue-600'
              } flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs`}
            >
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-slate-800 truncate">
                {currentUser.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 truncate">{currentUser.email}</span>
            </div>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isBottomUserMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      {/* DESKTOP FIXED LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col shrink-0 border-r border-slate-200 z-40 bg-white">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl flex flex-col animate-slide-in-left bg-white">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* MAIN RIGHT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Open Navigation Menu"
            >
              <PanelLeft className="w-5 h-5 text-slate-900" />
            </button>
            <Logo href="/" size="sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Quick "Get Number" CTA (Larger text) */}
            <Link
              href="/dashboard/buy-number"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm shadow-xs transition"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Get Number</span>
            </Link>

            {/* Top Bar Wallet Pill */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-xs">
              <Link
                href="/dashboard/wallet"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 text-xs hover:bg-white rounded-lg transition"
              >
                <Wallet className="w-4 h-4 text-slate-900 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-500 font-semibold leading-none">Available</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    {!isLoaded ? (
                      <span className="inline-block w-12 h-3 bg-slate-200 animate-pulse rounded my-0.5" />
                    ) : (
                      `₹${wallet.availableBalance.toFixed(2)}`
                    )}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleAddFundsClick}
                className="ml-1 p-2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg transition flex items-center justify-center cursor-pointer font-bold shrink-0 shadow-xs"
                title="Add Money"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </header>

        {/* Floating Active Order Notice Banner */}
        {activeOrder && activeOrder.status === 'WAITING_FOR_SMS' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-3 text-slate-900">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">Active Order:</span>
                  <span className="text-amber-800 font-bold">{activeOrder.serviceName}</span>
                  <span className="text-slate-600 font-medium">
                    ({activeOrder.countryFlag} {activeOrder.phoneNumber})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Timer:</span>
                  <OtpCountdownTimer
                    expiresAt={activeOrder.websiteExpiresAt}
                    className="scale-90"
                  />
                </div>

                <Link
                  href="/dashboard/buy-number"
                  className="px-3.5 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs transition flex items-center gap-1 shadow-xs"
                >
                  <span>View OTP Box</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Child Pages Content - Full Width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-6 py-4 text-xs font-medium text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto bg-white">
          <span>© {new Date().getFullYear()} SIM10 Platform. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-800 transition">
              Home Portal
            </Link>
          </div>
        </footer>
      </div>

      {/* Recharge Modal */}
      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
}
