'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Wallet,
} from 'lucide-react';

export default function AdminReportsPage() {
  const { orders, transactions, services, providers } = usePlatform();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');

  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.sellingPrice, 0);
  const totalCost = completedOrders.reduce((acc, curr) => acc + curr.providerCost, 0);
  const grossProfit = totalRevenue - totalCost;
  const marginPercentage = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';

  const totalRecharge = transactions
    .filter((t) => t.type === 'CREDIT_RECHARGE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 text-slate-800">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial & Margin Reports</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Revenue, provider actual costs, gross margin spread, and wallet recharge volume.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              timeRange === 'today' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              timeRange === '7days' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              timeRange === '30days' ? 'bg-[#0f172a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Gross Selling Revenue</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Customer order sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Provider Actual Cost</span>
          <div className="text-2xl font-black text-slate-700 font-mono tracking-tight">
            ₹{totalCost.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Paid upstream to carriers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Gross Profit</span>
          <div className="text-2xl font-black text-indigo-900 font-mono tracking-tight">
            ₹{grossProfit.toFixed(2)}
          </div>
          <span className="text-[11px] text-indigo-700 font-bold mt-1 block">
            Net Margin: {marginPercentage}%
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">Wallet Recharges</span>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            ₹{totalRecharge.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Total customer deposits</span>
        </div>
      </div>

      {/* Visual Revenue Breakdown & Provider Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Service Performance Table */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-800" />
            Service Volume & Profitability Breakdown
          </h3>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">Est. Cost</th>
                  <th className="px-4 py-3">Profit / Order</th>
                  <th className="px-4 py-3">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.slice(0, 8).map((s) => {
                  const profit = s.sellingPrice - s.providerCostEstimate;
                  const pct = ((profit / s.sellingPrice) * 100).toFixed(0);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        ₹{s.sellingPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 font-medium">
                        ₹{s.providerCostEstimate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        +₹{profit.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold border border-slate-200">
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-800" />
            Carrier Provider Share
          </h3>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            {providers.map((p) => {
              const totalAssigned = providers.reduce((a, b) => a + b.totalNumbersAssigned, 0);
              const widthPct = totalAssigned > 0 ? (p.totalNumbersAssigned / totalAssigned) * 100 : 0;

              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="text-slate-600 font-mono font-semibold">
                      {p.totalNumbersAssigned} Numbers Assigned
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full bg-[#0f172a]"
                      style={{ width: `${Math.min(100, widthPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Balance: ₹{p.balance.toFixed(2)}</span>
                    <span>Success: {p.successRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
