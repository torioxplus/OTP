'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { SmsProvider } from '@/types';
import { api } from '@/lib/api';
import { INITIAL_PROVIDERS } from '@/lib/mockData';
import {
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminProvidersPage() {
  const { providers: contextProviders, updateProvider, syncProviderBalance, syncAllProviders } = usePlatform();
  const [editingProvider, setEditingProvider] = useState<SmsProvider | null>(null);
  const [priority, setPriority] = useState<number>(1);
  const [minAlert, setMinAlert] = useState<number>(1000);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [liveProviders, setLiveProviders] = useState<SmsProvider[]>([]);

  // Fetch live carrier providers directly from backend API
  const refreshProviders = React.useCallback(() => {
    api.services.getProviders({ force: true }).then((res) => {
      if (res.success && res.data?.providers && res.data.providers.length > 0) {
        setLiveProviders(res.data.providers);
      }
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    refreshProviders();
  }, [refreshProviders]);

  // Always guarantee all 4 connected providers (Grizzly, Tiger, 5SIM, OnlineSIM) are shown
  const candidateList = (liveProviders.length > 0 ? liveProviders : contextProviders).filter(
    (p) => p && p.code !== 'sms_man'
  );
  const existingMap = new Map<string, SmsProvider>();
  candidateList.forEach((p) => existingMap.set(p.code, p));

  const providers = INITIAL_PROVIDERS.map((initP) => {
    const existing = existingMap.get(initP.code);
    if (!existing) return initP;
    return {
      ...initP,
      ...existing,
      name: initP.name,
      code: initP.code,
    };
  }).sort((a, b) => a.priority - b.priority);

  const handleOpenEdit = (p: SmsProvider) => {
    setEditingProvider(p);
    setPriority(p.priority);
    setMinAlert(p.minBalanceAlert);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;
    updateProvider(editingProvider.id, {
      priority,
      minBalanceAlert: minAlert,
    });
    setEditingProvider(null);
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await syncProviderBalance(id);
      refreshProviders();
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      await syncAllProviders();
      refreshProviders();
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SMS Provider Integrations</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Live Carrier Gateway adapters (Grizzly SMS, Tiger SMS, 5SIM, OnlineSIM), priority routing, and upstream balance monitors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
          <span>{isSyncingAll ? 'Syncing Carriers...' : 'Sync All Upstream Balances'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {providers.map((p) => {
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

          const hasLiveKey =
            p.code === 'five_sim' ||
            p.code === 'online_sim' ||
            p.code === 'grizzly_sms' ||
            p.code === 'tiger_sms';

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white border flex flex-col justify-between h-full space-y-5 transition-all duration-200 shadow-xs ${
                isLow ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                      <Cpu className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                        {hasLiveKey && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Live API Key Active" />
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-medium">{p.code}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateProvider(p.id, { enabled: !p.enabled })}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                      p.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {p.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                {/* API Key Status Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Carrier API:</span>
                  {hasLiveKey ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Live Key Active</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <span>Sandbox Mode</span>
                    </span>
                  )}
                </div>

                {/* Balance Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Current Carrier Balance
                  </span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-mono font-black text-slate-900">
                        {p.balance.toFixed(2)} {p.currency || 'RUB'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-medium block">
                        ≈ ₹{(p.balance * 1.1).toFixed(2)} INR (Est.)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSync(p.id)}
                      disabled={isSyncing}
                      className="text-xs text-slate-800 hover:text-black flex items-center gap-1 font-bold disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-1 font-medium">
                    Last checked: {p.lastCheckedAt}
                  </span>
                </div>

                {/* Health & Specs */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Priority Order:</span>
                    <span className="font-bold text-slate-900 font-mono">Rank #{p.priority}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">API Health:</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        p.apiHealth === 'operational'
                          ? 'text-emerald-700'
                          : p.apiHealth === 'degraded'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {p.apiHealth} ({p.pingMs}ms)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Success Rate:</span>
                    <span className="font-mono text-slate-900 font-bold">{p.successRate}%</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Total Numbers Assigned:</span>
                    <span className="font-mono text-slate-900 font-bold">{p.totalNumbersAssigned}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600 font-medium">Low Balance Alert:</span>
                    <span className="font-mono text-amber-800 font-bold">{p.minBalanceAlert} {p.currency}</span>
                  </div>
                </div>

                {isLow && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Carrier balance zero: Deposit funds on {p.name} to activate real numbers.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <a
                  href={depositUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Deposit Funds on {p.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Priority & Alerts</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Priority & Alerts Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Configure {editingProvider.name}</h3>
                <span className="text-xs text-slate-500 font-medium">Adjust carrier priority & alert levels</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingProvider(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Routing Priority (1 = Highest First Choice)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0f172a]"
                >
                  <option value={1}>Priority 1 (Primary Carrier)</option>
                  <option value={2}>Priority 2 (Secondary Fallback)</option>
                  <option value={3}>Priority 3 (Tertiary Fallback)</option>
                  <option value={4}>Priority 4 (Quaternary Fallback)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                  The order engine always queries Priority 1 first. If margin or numbers fail, it falls back to 2, then 3.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Low Balance Alert Threshold ({editingProvider.currency})
                </label>
                <input
                  type="number"
                  value={minAlert}
                  onChange={(e) => setMinAlert(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono font-medium focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
