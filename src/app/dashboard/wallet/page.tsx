'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/context/PlatformContext';
import { RechargeModal } from '@/components/RechargeModal';
import {
  Wallet,
  Clock,
  PlusCircle,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function WalletPage() {
  const { wallet, transactions, isLoaded } = usePlatform();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  const totalCredits = transactions
    .filter((t) => t.type === 'CREDIT_RECHARGE' || t.type === 'RELEASE_HOLD' || t.type === 'REFUND')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebits = transactions
    .filter((t) => t.type === 'DEBIT_OTP_PURCHASE')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Wallet</h1>
          <p className="text-xs text-slate-600 mt-1">
            Secure balance ledger with transactional hold locking and instantaneous refunds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRechargeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Top Up Balance</span>
          </button>

          <Link
            href="/dashboard/wallet/transactions"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Full Ledger</span>
          </Link>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0f172a]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {!isLoaded ? (
              <div className="h-9 w-32 bg-slate-200 animate-pulse rounded my-1" />
            ) : (
              `₹${wallet.availableBalance.toFixed(2)}`
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Usable for immediate virtual number reservations
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">Held Balance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono tracking-tight">
            {!isLoaded ? (
              <div className="h-9 w-24 bg-slate-200 animate-pulse rounded my-1" />
            ) : (
              `₹${wallet.heldBalance.toFixed(2)}`
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Locked during active 5-min timer. Released if no SMS.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">Lifetime Ledger Debits</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {!isLoaded ? (
              <div className="h-9 w-28 bg-slate-200 animate-pulse rounded my-1" />
            ) : (
              `₹${totalDebits.toFixed(2)}`
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Total verified OTP purchases settled
          </p>
        </div>
      </div>

      {/* Wallet Architecture Safeguards */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0f172a]" />
          <h3 className="text-sm font-bold text-slate-900">How Your Wallet Ledger Operates</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <span className="font-bold text-slate-900 block">1. Hold On Order</span>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              When you click &ldquo;Get Number&rdquo;, the exact service price (e.g. ₹15) is placed on HOLD.
              It is not yet debited from your account.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <span className="font-bold text-slate-900 block">2. Final Debit Only on SMS</span>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              Only when an incoming SMS code is verified by our carrier network does the hold
              convert to a final completed transaction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <span className="font-bold text-slate-900 block">3. Instant Hold Release</span>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              If the order is cancelled by you or the 5-minute timer expires with no SMS, the held
              funds are automatically returned to your available balance.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Ledger Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
          <Link
            href="/dashboard/wallet/transactions"
            className="text-xs text-[#0f172a] hover:underline font-bold"
          >
            View Full Audit Trail →
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance After</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.slice(0, 6).map((txn) => {
                const isCredit =
                  txn.type === 'CREDIT_RECHARGE' ||
                  txn.type === 'RELEASE_HOLD' ||
                  txn.type === 'REFUND';
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{txn.id}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          txn.type === 'CREDIT_RECHARGE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : txn.type === 'HOLD_OTP_PURCHASE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : txn.type === 'RELEASE_HOLD'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : txn.type === 'DEBIT_OTP_PURCHASE'
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{txn.description}</td>
                    <td
                      className={`px-4 py-3 font-mono font-black ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 font-bold">
                      ₹{txn.balanceAfter.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium text-[11px]">
                      {new Date(txn.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
}
