'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { ServiceIcon } from '@/components/ServiceIcon';
import { OtpOrder } from '@/types';
import {
  Search,
  Filter,
  Download,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  FileText,
} from 'lucide-react';

export default function ActivationsPage() {
  const { orders } = usePlatform();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OtpOrder | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.phoneNumber.includes(search) ||
      o.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Order ID,Service,Country,Phone Number,Selling Price,Status,Ordered At,OTP Code\n'];
    const rows = filteredOrders.map(
      (o) =>
        `"${o.id}","${o.serviceName}","${o.countryName}","${o.phoneNumber}",${o.sellingPrice},"${o.status}","${o.orderedAt}","${o.smsReceived?.otpCode || ''}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activations_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activation History</h1>
          <p className="text-xs text-slate-600 mt-1">
            Complete record of all temporary number orders, verification OTPs, and status reports.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by phone number, service, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-xs"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 shadow-xs cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed (SMS Received)</option>
            <option value="WAITING_FOR_SMS">Waiting for SMS</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Activations Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Service & App</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Received OTP</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ordered At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <ServiceIcon name={order.serviceIcon} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{order.serviceName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {order.countryFlag} {order.countryName}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-900 font-bold">
                    <div className="flex items-center gap-2">
                      <span>{order.phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.phoneNumber, order.id + '_phone')}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy Number"
                      >
                        {copiedText === order.id + '_phone' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {order.smsReceived ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-[#0f172a] font-mono font-black text-xs">
                          {order.smsReceived.otpCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.smsReceived!.otpCode, order.id + '_otp')}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Copy OTP"
                        >
                          {copiedText === order.id + '_otp' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-black text-slate-900">
                    ₹{order.sellingPrice.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : order.status === 'WAITING_FOR_SMS'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : order.status === 'REFUNDED'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 font-medium text-[11px]">
                    {new Date(order.orderedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f172a]" />
                <h3 className="text-sm font-bold text-slate-900">Order Details</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Order ID:</span>
                <span className="font-mono text-slate-900 font-bold">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Service:</span>
                <span className="text-slate-900 font-bold">{selectedOrder.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Phone Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedOrder.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Selling Price:</span>
                <span className="font-mono font-black text-[#0f172a]">
                  ₹{selectedOrder.sellingPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Provider:</span>
                <span className="text-slate-800 font-medium">{selectedOrder.providerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-semibold">Status:</span>
                <span className="font-bold text-[#0f172a]">{selectedOrder.status}</span>
              </div>

              {selectedOrder.smsReceived && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Full Received SMS:</span>
                    <span className="font-mono text-slate-500 font-semibold">
                      {selectedOrder.smsReceived.sender}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium italic">&ldquo;{selectedOrder.smsReceived.message}&rdquo;</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Extracted OTP Code:</span>
                    <span className="font-mono font-black text-white text-base bg-[#0f172a] px-2.5 py-0.5 rounded shadow-xs">
                      {selectedOrder.smsReceived.otpCode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
