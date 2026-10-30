'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { ServiceIcon } from '@/components/ServiceIcon';
import { OtpOrder } from '@/types';
import {
  Package,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Copy,
  Check,
  Zap,
  TrendingUp,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, adminRefundOrder } = usePlatform();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [refundingOrder, setRefundingOrder] = useState<OtpOrder | null>(null);
  const [refundReason, setRefundReason] = useState('Admin approved customer refund');
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.phoneNumber.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      o.providerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.providerOrderId && o.providerOrderId.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'REAL' && o.isRealProvider) ||
      (sourceFilter === 'SANDBOX' && !o.isRealProvider);

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundingOrder) return;
    adminRefundOrder(refundingOrder.id, refundReason);
    setRefundingOrder(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtpId(id);
    setTimeout(() => setCopiedOtpId(null), 2000);
  };

  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const waitingCount = orders.filter((o) => o.status === 'WAITING_FOR_SMS').length;
  const totalProfit = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.grossMargin || o.sellingPrice - o.providerCost), 0);

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform OTP Orders Stream</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time orders log, upstream carrier tracking (5SIM/OnlineSIM), margin breakdowns, and manual refunds.
          </p>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total Orders</span>
          <span className="text-xl font-black text-slate-900 font-mono tracking-tight mt-1 block">{orders.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Active Waiting</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xl font-black text-amber-800 font-mono tracking-tight">{waitingCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Completed (100% Delivered)</span>
          <span className="text-xl font-black text-emerald-700 font-mono tracking-tight mt-1 block">{completedCount}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Gross Margin Earned</span>
          <span className="text-xl font-black text-slate-900 font-mono tracking-tight mt-1 block">₹{totalProfit.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID, phone, service, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0f172a] transition shadow-2xs font-medium"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#0f172a] transition cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="WAITING_FOR_SMS">WAITING_FOR_SMS</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#0f172a] transition cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Carrier Sources</option>
            <option value="REAL">Real Carrier Numbers</option>
            <option value="SANDBOX">Sandbox Mode Numbers</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Carrier / Sourcing</th>
                <th className="px-4 py-3">Assigned Number</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Profit Margin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received OTP Code</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 font-medium">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const margin = order.grossMargin || order.sellingPrice - order.providerCost;
                  const isReal = order.isRealProvider;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                        {order.id}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <ServiceIcon name={order.serviceIcon} className="w-4 h-4" />
                          <span className="font-bold text-slate-900">{order.serviceName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{order.countryCode}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-semibold block">{order.providerName}</span>
                          {isReal ? (
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Real Carrier
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                              Sandbox
                            </span>
                          )}
                          {order.providerOrderId && (
                            <span className="text-[9px] text-slate-500 font-mono block">
                              #{order.providerOrderId.slice(0, 15)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-800 font-medium">
                        {order.phoneNumber}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        ₹{order.sellingPrice.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-slate-700">
                        +₹{margin.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'WAITING_FOR_SMS'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                              : order.status === 'REFUNDED'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : order.status === 'EXPIRED'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono">
                        {order.smsReceived ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-900 font-bold text-xs tracking-wider border border-slate-200">
                              {order.smsReceived.otpCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(order.smsReceived!.otpCode, order.id)}
                              className="text-slate-400 hover:text-slate-800 p-1 rounded cursor-pointer"
                              title="Copy OTP"
                            >
                              {copiedOtpId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic font-medium">Waiting for SMS...</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {order.status === 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => setRefundingOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Refund</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Refund Modal */}
      {refundingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Refund Order #{refundingOrder.id}</h3>
              <button
                type="button"
                onClick={() => setRefundingOrder(null)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Order Service:</span>
                  <span className="text-slate-900 font-bold">{refundingOrder.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Customer Refund Amount:</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    ₹{refundingOrder.sellingPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Refund Reason / Ledger Audit Reference
                </label>
                <input
                  type="text"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-sm transition"
                >
                  Confirm & Credit User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
