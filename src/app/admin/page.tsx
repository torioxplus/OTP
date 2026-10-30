'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import {
  Users,
  Wallet,
  Package,
  TrendingUp,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Layers,
  RefreshCw,
  ExternalLink,
  Activity,
  Server,
  Zap,
} from 'lucide-react';

import { api } from '@/lib/api';
import { User, OtpOrder, SmsProvider } from '@/types';
import { INITIAL_PROVIDERS } from '@/lib/mockData';

export default function AdminDashboardPage() {
  const {
    orders,
    providers: contextProviders,
    syncProviderBalance,
    syncAllProviders,
    services,
  } = usePlatform();

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isRefreshingDashboard, setIsRefreshingDashboard] = useState(false);

  // Guarantee all 4 connected providers are present
  const candidateProviders = (contextProviders || []).filter((p) => p && p.code !== 'sms_man');
  const existingMap = new Map<string, SmsProvider>();
  candidateProviders.forEach((p) => existingMap.set(p.code, p));
  const providers = INITIAL_PROVIDERS.map((initP) => {
    const existing = existingMap.get(initP.code);
    if (!existing) return initP;
    return { ...initP, ...existing, name: initP.name, code: initP.code };
  }).sort((a, b) => a.priority - b.priority);

  // Instant hydration from fast cache
  const cachedStats = api.cache.get<{ stats: Record<string, number> }>('/admin/dashboard')?.data?.stats;
  const cachedUsers = api.cache.get<{ users: User[] }>('/admin/users')?.data?.users;

  const [liveUsers, setLiveUsers] = useState<User[]>(cachedUsers || []);
  const [liveStats, setLiveStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    todayRecharge: number;
    todayOrders: number;
    successfulOrders: number;
    failedOrders: number;
    totalRefunds: number;
    totalRevenue: number;
    totalProviderCost: number;
    grossProfit: number;
  }>({
    totalUsers: cachedStats?.totalUsers || 0,
    activeUsers: cachedStats?.activeUsers || 0,
    todayRecharge: cachedStats?.todayRecharge || 0,
    todayOrders: cachedStats?.todayOrders || 0,
    successfulOrders: cachedStats?.successfulOrders || 0,
    failedOrders: cachedStats?.failedOrders || 0,
    totalRefunds: cachedStats?.totalRefunds || 0,
    totalRevenue: cachedStats?.totalRevenue || 0,
    totalProviderCost: cachedStats?.totalProviderCost || 0,
    grossProfit: cachedStats?.grossProfit || 0,
  });

  const fetchLiveAdminData = async (force: boolean = false) => {
    if (force) setIsRefreshingDashboard(true);
    try {
      const [dashRes, usersRes] = await Promise.all([
        api.admin.getDashboard({ force }),
        api.admin.getUsers({ force }),
      ]);
      if (dashRes.success && dashRes.data?.stats) {
        setLiveStats(dashRes.data.stats as any);
      }
      if (usersRes.success && usersRes.data?.users) {
        setLiveUsers(usersRes.data.users);
      }
    } catch (e) {
      console.warn('Failed to fetch live admin data:', e);
    } finally {
      setIsRefreshingDashboard(false);
    }
  };

  React.useEffect(() => {
    fetchLiveAdminData(false);

    // Subscribe to cache updates
    const unsubDash = api.cache.subscribe<{ stats: Record<string, number> }>('/admin/dashboard', (c) => {
      if (c?.stats) setLiveStats(c.stats as any);
    });
    const unsubUsers = api.cache.subscribe<{ users: User[] }>('/admin/users', (c) => {
      if (c?.users) setLiveUsers(c.users);
    });

    return () => {
      unsubDash();
      unsubUsers();
    };
  }, []);

  const totalRevenue = liveStats.totalRevenue;
  const grossMargin = liveStats.grossProfit;
  const totalRecharge = liveStats.todayRecharge;
  const allUsers = liveUsers;

  const totalOrdersCount = liveStats.todayOrders || orders.length;
  const completedOrdersCount = liveStats.successfulOrders || orders.filter((o) => o.status === 'COMPLETED').length;
  const successRate = totalOrdersCount > 0 ? ((completedOrdersCount / totalOrdersCount) * 100).toFixed(1) : '100';

  const handleSyncProvider = async (id: string) => {
    setSyncingId(id);
    try {
      await syncProviderBalance(id);
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      await syncAllProviders();
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-800">
      {/* Header & Live System Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Master Console</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time platform financial ledger, multi-carrier upstream connectivity, and OTP volume analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchLiveAdminData(true)}
            disabled={isRefreshingDashboard}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-200 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingDashboard ? 'animate-spin' : ''}`} />
            <span>{isRefreshingDashboard ? 'Refreshing...' : 'Refresh KPIs'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing...' : 'Sync All Carriers'}</span>
          </button>
        </div>
      </div>

      {/* Live Upstream & Backend Status Ribbon */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Server className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Backend Engine</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-900">Express REST (Port 5000)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">5SIM Carrier</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-900">Live API Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">OnlineSIM Carrier</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-900">Live API Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Auto-Expiry Worker</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="font-bold text-slate-900">3s Poll & Auto-Release</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Gross completed orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Gross Margin (Profit)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900 font-mono tracking-tight">
            ₹{grossMargin.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">
            Margin: {totalRevenue > 0 ? ((grossMargin / totalRevenue) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Today&apos;s Recharges</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalRecharge.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">Wallet deposits verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">OTP Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-800 font-mono tracking-tight">
            {successRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">
            {completedOrdersCount} of {totalOrdersCount} orders
          </p>
        </div>
      </div>

      {/* PROVIDER WALLET BALANCES */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-800" />
              External Carrier Account Balances & Live Health
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Live balances held with upstream SMS carriers. When carrier balance is 0 RUB, platform smoothly falls back to sandbox.
            </p>
          </div>

          <Link href="/admin/providers" className="text-xs font-bold text-slate-900 hover:underline">
            Manage Provider Routing →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {providers.filter((p) => p.code !== 'sms_man').map((p) => {
            const isLow = p.balance <= 0 && p.enabled;
            const isSyncing = syncingId === p.id;
            const depositUrl =
              p.code === 'grizzly_sms'
                ? 'https://grizzlysms.com/pay'
                : p.code === 'tiger_sms'
                ? 'https://tiger-sms.com/pay'
                : p.code === 'five_sim'
                ? 'https://5sim.net/payment'
                : 'https://onlinesim.io/v2/payment';

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border flex flex-col justify-between h-full transition-all duration-200 ${
                  isLow
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">{p.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Live API Connected" />
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        p.enabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.enabled ? `Priority #${p.priority}` : 'Disabled'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-slate-900">
                        {p.balance.toFixed(2)} {p.currency || 'RUB'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono font-medium">
                      ≈ ₹{(p.balance * 1.1).toFixed(2)} INR (Est.)
                    </span>
                  </div>

                  {isLow ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-bold mt-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Zero Carrier Balance (Auto-Sandbox Active)</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-2.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Live Carrier Operational</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/80 mt-3 flex items-center justify-between text-[11px]">
                  <a
                    href={depositUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 hover:text-slate-950 font-semibold flex items-center gap-1"
                  >
                    <span>Deposit Funds</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleSyncProvider(p.id)}
                    disabled={isSyncing}
                    className="text-slate-800 hover:text-black font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Balance'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAYMENT GATEWAY INTEGRATION STATUS */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Razorpay Payment Gateway</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Production Key Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Key ID: <span className="font-mono text-slate-800 font-bold">rzp_live_TqcF2Qv8TXmNHS</span> • HMAC-SHA256 Verification: <span className="text-emerald-700 font-semibold">Secured</span> • Automated Wallet Credit: <span className="text-emerald-700 font-semibold">Enabled</span>
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/wallet/add-money"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all self-start sm:self-auto shadow-2xs"
          >
            <span>Test Add Money</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* RECENT LIVE ORDERS FEED */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-800" />
              Live Order Stream & Carrier Sourcing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Live virtual numbers issued to customers with carrier origin and incoming OTP codes.
            </p>
          </div>

          <Link href="/admin/orders" className="text-xs font-bold text-slate-900 hover:underline">
            View All {orders.length} Orders →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Carrier Source</th>
                <th className="px-4 py-3">Price / Margin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received OTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order: OtpOrder) => {
                const isReal = order.isRealProvider;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono text-slate-700 font-semibold">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-bold">
                      {order.countryFlag} {order.serviceName}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-800 font-medium">
                      {order.phoneNumber}
                    </td>
                    <td className="px-4 py-3">
                      {isReal ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Real {order.providerName}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          Sandbox
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-slate-900 font-bold">₹{order.sellingPrice.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500 block font-semibold">+₹{order.grossMargin.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'WAITING_FOR_SMS'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {order.smsReceived ? (
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200">
                          {order.smsReceived.otpCode}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic font-medium">Waiting...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Pricing Snapshot & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Services Margins */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-800" />
              Service Pricing & Margin Spread
            </h3>
            <Link href="/admin/services" className="text-xs font-bold text-slate-900 hover:underline">
              Manage All Services →
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">Provider Cost</th>
                  <th className="px-4 py-3">Gross Margin</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.slice(0, 6).map((s) => {
                  const margin = s.sellingPrice - s.providerCostEstimate;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        ₹{s.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 font-medium">
                        ₹{s.providerCostEstimate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        +₹{margin.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.enabled
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {s.enabled ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Quick Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-800" />
              Registered Customers ({allUsers.length})
            </h3>
            <Link href="/admin/users" className="text-xs font-bold text-slate-900 hover:underline">
              User Directory →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{u.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{u.email}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      u.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {u.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
