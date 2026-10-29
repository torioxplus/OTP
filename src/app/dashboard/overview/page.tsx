'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { ServiceIcon } from '@/components/ServiceIcon';
import { RechargeModal } from '@/components/RechargeModal';
import {
  Wallet,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
  Copy,
  Check,
} from 'lucide-react';

export default function OverviewPage() {
  const { currentUser, wallet, orders, transactions, providers, isLoaded } = usePlatform();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalSpent = completedOrders.reduce((acc, curr) => acc + curr.sellingPrice, 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome & Balance Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Account ID: <span className="font-mono text-slate-800 font-bold">{currentUser.id}</span> • Status:{' '}
            <span className="text-slate-900 font-extrabold uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              {currentUser.status}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRechargeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md shadow-slate-900/15 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Funds</span>
          </button>

          <Link
            href="/dashboard/buy-number"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 border-2 border-slate-300 shadow-2xs"
          >
            <Zap className="w-4 h-4 text-slate-900" />
            <span>Get Number</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {!isLoaded ? (
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded my-1" />
            ) : (
              `₹${wallet.availableBalance.toFixed(2)}`
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">Ready for number purchase</p>
        </div>

        {/* Funds in Hold */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Funds in Hold</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tracking-tight">
            {!isLoaded ? (
              <div className="h-8 w-20 bg-slate-200 animate-pulse rounded my-1" />
            ) : (
              `₹${wallet.heldBalance.toFixed(2)}`
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">Held during 5-min order timer</p>
        </div>

        {/* Successful Activations */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Successful Activations</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {completedOrders.length}
          </div>
          <p className="text-xs text-slate-600 font-semibold">100% verified codes</p>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalSpent.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 font-medium">Lifetime account usage</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Activations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-900" />
              Recent Activations
            </h3>
            <Link
              href="/dashboard/activations"
              className="text-xs font-bold text-[#0f172a] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-2xs">
                <span className="text-sm font-bold text-slate-800 block">No recent activations</span>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you reserve temporary numbers, your live OTP codes and delivery reports will appear here.
                </p>
                <Link
                  href="/dashboard/buy-number"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs"
                >
                  <span>Buy Temporary Number</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <ServiceIcon name={order.serviceIcon} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{order.serviceName}</span>
                        <span className="text-xs font-medium text-slate-500">{order.countryFlag}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 block mt-0.5">
                        {order.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    {order.smsReceived && (
                      <div className="hidden sm:flex flex-col text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">OTP</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.smsReceived!.otpCode, order.id)}
                          className="font-mono font-black text-sm text-[#0f172a] hover:underline flex items-center gap-1"
                        >
                          {order.smsReceived.otpCode}
                          {copiedId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-900 border border-slate-300'
                            : order.status === 'WAITING_FOR_SMS'
                            ? 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 mt-1">
                        ₹{order.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Wallet Activity & System Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-900" />
                Recent Ledger Activity
              </h3>
              <Link
                href="/dashboard/wallet/transactions"
                className="text-xs font-bold text-[#0f172a] hover:underline"
              >
                Full Ledger →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-3">
              {transactions.length === 0 ? (
                <div className="py-6 text-center text-xs font-semibold text-slate-500">
                  No ledger activity recorded yet.
                </div>
              ) : (
                transactions.slice(0, 4).map((txn) => {
                  const isCredit = txn.type === 'CREDIT_RECHARGE' || txn.type === 'RELEASE_HOLD';
                  return (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          {txn.type}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{txn.description}</span>
                      </div>
                      <span
                        className={`font-mono font-black text-sm ${
                          isCredit ? 'text-[#0f172a]' : 'text-slate-700'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹{txn.amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Provider Network Live Status */}
          <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Carrier Network Status
            </h4>
            <div className="space-y-2.5">
              {providers.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        p.apiHealth === 'operational'
                          ? 'bg-emerald-600'
                          : p.apiHealth === 'degraded'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-slate-800 font-bold">{p.name}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    {p.pingMs}ms • {p.successRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
}
