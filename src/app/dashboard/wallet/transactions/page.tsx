'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function TransactionsLedgerPage() {
  const { transactions } = usePlatform();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = [
      'Txn ID,Type,Amount,Balance Before,Balance After,Hold Before,Hold After,Reference,Description,Status,Date\n',
    ];
    const rows = filteredTxns.map(
      (t) =>
        `"${t.id}","${t.type}",${t.amount},${t.balanceBefore},${t.balanceAfter},${t.holdBefore},${t.holdAfter},"${t.referenceType}:${t.referenceId}","${t.description}","${t.status}","${t.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Transaction Ledger
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Complete immutable ledger of all credits, holds, debits, releases, and adjustments.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by transaction ID, reference, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-xs"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 shadow-xs cursor-pointer"
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

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance (Before → After)</th>
                <th className="px-4 py-3">Hold (Before → After)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTxns.map((txn) => {
                const isCredit =
                  txn.type === 'CREDIT_RECHARGE' ||
                  txn.type === 'RELEASE_HOLD' ||
                  txn.type === 'REFUND' ||
                  txn.type === 'ADMIN_CREDIT';
                return (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{txn.id}</td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          txn.type === 'CREDIT_RECHARGE' || txn.type === 'ADMIN_CREDIT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : txn.type === 'HOLD_OTP_PURCHASE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : txn.type === 'RELEASE_HOLD' || txn.type === 'REFUND'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : txn.type === 'DEBIT_OTP_PURCHASE'
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <span className="text-slate-900 font-medium block truncate">{txn.description}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-medium">
                        Ref: {txn.referenceId}
                      </span>
                    </td>

                    <td
                      className={`px-4 py-3.5 font-mono font-black ${
                        isCredit ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">
                      ₹{txn.balanceBefore.toFixed(2)} →{' '}
                      <span className="text-slate-900 font-bold">₹{txn.balanceAfter.toFixed(2)}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">
                      ₹{txn.holdBefore.toFixed(2)} →{' '}
                      <span
                        className={
                          txn.holdAfter > 0 ? 'text-amber-700 font-bold' : 'text-slate-700 font-medium'
                        }
                      >
                        ₹{txn.holdAfter.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        {txn.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 font-medium text-[11px] whitespace-nowrap">
                      {new Date(txn.createdAt).toLocaleString([], {
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
