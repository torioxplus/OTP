'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { ServiceItem } from '@/types';
import { ServiceIcon } from '@/components/ServiceIcon';
import {
  Search,
  Edit2,
  X,
} from 'lucide-react';

export default function AdminServicesPage() {
  const { services, updateService, toggleServiceStatus } = usePlatform();
  const [search, setSearch] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Edit form states
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [minMargin, setMinMargin] = useState<number>(0);
  const [maxProviderCost, setMaxProviderCost] = useState<number>(0);

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setSellingPrice(s.sellingPrice);
    setMinMargin(s.minimumMargin);
    setMaxProviderCost(s.maximumProviderCost);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, {
      sellingPrice,
      minimumMargin: minMargin,
      maximumProviderCost: maxProviderCost,
    });
    setEditingService(null);
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase()) ||
    s.serviceCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Pricing & Margins</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Configure customer selling prices, minimum profit margins, and max provider cost limits.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter services by name, slug or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0f172a] transition shadow-2xs font-medium"
        />
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Service Name</th>
                <th className="px-4 py-3">Service Code</th>
                <th className="px-4 py-3">Selling Price (₹)</th>
                <th className="px-4 py-3">Est. Provider Cost</th>
                <th className="px-4 py-3">Min. Margin (₹)</th>
                <th className="px-4 py-3">Max Provider Cost (₹)</th>
                <th className="px-4 py-3">Active Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <ServiceIcon name={service.iconName} className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{service.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">{service.serviceCode}</td>

                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700 text-sm">
                    ₹{service.sellingPrice.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">
                    ₹{service.providerCostEstimate.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">
                    ₹{service.minimumMargin.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-rose-700 font-medium">
                    ₹{service.maximumProviderCost.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer ${
                        service.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {service.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(service)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Price</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Pricing Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Edit Pricing: {editingService.name}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Customer Selling Price (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-emerald-700 font-mono font-bold text-sm focus:outline-none focus:border-[#0f172a]"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  The exact price customer will be charged upon order.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Minimum Protected Margin (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={minMargin}
                  onChange={(e) => setMinMargin(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-mono text-xs font-semibold focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Maximum Provider Cost Cap (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={maxProviderCost}
                  onChange={(e) => setMaxProviderCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-rose-700 font-mono text-xs font-semibold focus:outline-none focus:border-[#0f172a]"
                />
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  If carrier price is higher than this, backend will abort order purchase.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
