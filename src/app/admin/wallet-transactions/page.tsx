'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { Search, Download } from 'lucide-react';

export default function AdminWalletTransactionsPage() {
  const { transactions } = usePlatform();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.userId.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = [
      'Txn ID,User ID,Type,Amount,Balance Before,Balance After,Hold Before,Hold After,Reference,Description,Status,Date\n',
    ];
    const rows = filteredTxns.map(
      (t) =>
        `"${t.id}","${t.userId}","${t.type}",${t.amount},${t.balanceBefore},${t.balanceAfter},${t.holdBefore},${t.holdAfter},"${t.referenceType}:${t.referenceId}","${t.description}","${t.status}","${t.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_global_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Wallet Ledger</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Master immutable financial ledger across all users and system adjustments.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Master Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by txn ID, user ID, description, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0f172a] transition shadow-2xs font-medium"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#0f172a] transition cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Transaction Types</option>
            <option value="CREDIT_RECHARGE">CREDIT_RECHARGE</option>
            <option value="HOLD_OTP_PURCHASE">HOLD_OTP_PURCHASE</option>
            <option value="DEBIT_OTP_PURCHASE">DEBIT_OTP_PURCHASE</option>
            <option value="RELEASE_HOLD">RELEASE_HOLD</option>
            <option value="REFUND">REFUND</option>
            <option value="ADMIN_CREDIT">ADMIN_CREDIT</option>
            <option value="ADMIN_DEBIT">ADMIN_DEBIT</option>
          </select>
        </div>
      </div>

      {/* Master Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Available (Before → After)</th>
                <th className="px-4 py-3">Held (Before → After)</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.map((t) => {
                const isCredit =
                  t.type === 'CREDIT_RECHARGE' ||
                  t.type === 'RELEASE_HOLD' ||
                  t.type === 'REFUND' ||
                  t.type === 'ADMIN_CREDIT';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">{t.id}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">{t.userId}</td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          t.type === 'CREDIT_RECHARGE' || t.type === 'ADMIN_CREDIT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : t.type === 'HOLD_OTP_PURCHASE'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : t.type === 'RELEASE_HOLD' || t.type === 'REFUND'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : t.type === 'DEBIT_OTP_PURCHASE'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>

                    <td
                      className={`px-4 py-3.5 font-mono font-bold ${
                        isCredit ? 'text-emerald-700' : 'text-slate-800'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{t.amount.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      ₹{t.balanceBefore.toFixed(2)} →{' '}
                      <span className="text-slate-900 font-bold">₹{t.balanceAfter.toFixed(2)}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      ₹{t.holdBefore.toFixed(2)} → ₹{t.holdAfter.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 max-w-xs truncate font-medium">{t.description}</td>

                    <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap font-medium">
                      {new Date(t.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
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
    </div>
  );
}
