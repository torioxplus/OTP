'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import {
  Shield,
  LayoutDashboard,
  Layers,
  Cpu,
  Users,
  Package,
  FileText,
  BarChart3,
  ArrowLeft,
  AlertTriangle,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAdminAuthenticated,
    loginWithAdminKey,
    switchRole,
    providers,
  } = usePlatform();

  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If NOT authenticated as admin, show the Superadmin Key Gate (Crisp Light Theme)
  if (!isAdminAuthenticated) {
    const handleKeySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setKeyError(null);
      setIsVerifying(true);

      try {
        const result = await loginWithAdminKey(inputKey);
        if (!result.success) {
          setKeyError(result.error || 'Invalid administrator key');
        }
      } catch {
        setKeyError('Authentication failed. Please verify credentials.');
      } finally {
        setIsVerifying(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0f172a] flex items-center justify-center text-white shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
              Superadmin Portal Access
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              This area is strictly restricted to platform administrators. Enter your Master
              Superadmin Key to unlock administrative privileges.
            </p>
          </div>

          {keyError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{keyError}</span>
            </div>
          )}

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Superadmin Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setKeyError(null);
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:outline-none focus:border-[#0f172a]"
                  placeholder="Enter superadmin key..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !inputKey.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Key...' : 'Authenticate & Unlock'}</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // When Authenticated as Admin:
  const lowBalanceProviders = providers.filter(
    (p) => p.code !== 'sms_man' && p.balance < p.minBalanceAlert && p.enabled
  );

  const adminSections = [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'PLATFORM INVENTORY',
      items: [
        { label: 'Services & Pricing', href: '/admin/services', icon: Layers },
        { label: 'SMS Providers', href: '/admin/providers', icon: Cpu },
      ],
    },
    {
      title: 'USERS & TRANSACTIONS',
      items: [
        { label: 'Users & Balances', href: '/admin/users', icon: Users },
        { label: 'OTP Orders', href: '/admin/orders', icon: Package },
        { label: 'Global Ledger', href: '/admin/wallet-transactions', icon: FileText },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Revenue & Reports', href: '/admin/reports', icon: BarChart3 },
      ],
    },
  ];

  const getCurrentAdminTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname?.includes('/admin/services')) return 'Services & Pricing';
    if (pathname?.includes('/admin/providers')) return 'SMS Carrier Providers';
    if (pathname?.includes('/admin/users')) return 'Users & Accounts';
    if (pathname?.includes('/admin/orders')) return 'OTP Orders';
    if (pathname?.includes('/admin/wallet-transactions')) return 'Global Ledger';
    if (pathname?.includes('/admin/reports')) return 'Financial Reports';
    return 'Superadmin Console';
  };

  const adminSidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* Brand */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                SIM10<span className="text-slate-600 font-semibold ml-0.5">Admin</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-slate-100 text-slate-800 border border-slate-300">
                Master
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">Superadmin Console</span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          title="Close Admin Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-5 no-scrollbar">
        {adminSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <span className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {section.title}
            </span>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition font-semibold ${
                      isActive
                        ? 'bg-[#0f172a] text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Switcher */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => {
            switchRole('customer');
            router.push('/dashboard/buy-number');
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Admin Mode</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col shrink-0 border-r border-slate-200 z-40 bg-white">
        {adminSidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl flex flex-col bg-white">
            {adminSidebarContent}
          </div>
        </div>
      )}

      {/* Main Right Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900 text-sm">{getCurrentAdminTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lowBalanceProviders.length > 0 && (
              <Link
                href="/admin/providers"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Low Balance:</span>
                <span>{lowBalanceProviders.length} Providers</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                switchRole('customer');
                router.push('/dashboard/buy-number');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
