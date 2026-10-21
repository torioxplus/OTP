'use client';

import React, { useState, useEffect } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { api } from '@/lib/api';
import { User } from '@/types';
import {
  Users,
  Search,
  Wallet,
  Shield,
  ShieldAlert,
  Edit,
  DollarSign,
  CheckCircle2,
  XCircle,
  PlusCircle,
  MinusCircle,
  X,
  RefreshCw,
} from 'lucide-react';

interface ExtendedUser extends User {
  walletBalance?: number;
}

export default function AdminUsersPage() {
  const { allUsers: contextUsers } = usePlatform();
  const [usersList, setUsersList] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjustingUser, setAdjustingUser] = useState<ExtendedUser | null>(null);

  // Adjustment form states
  const [adjustType, setAdjustType] = useState<'ADMIN_CREDIT' | 'ADMIN_DEBIT'>('ADMIN_CREDIT');
  const [amount, setAmount] = useState<number>(100);
  const [reason, setReason] = useState<string>('Courtesy credit adjustment');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchLiveUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res.success && res.data?.users) {
        setUsersList(res.data.users as ExtendedUser[]);
      } else if (contextUsers && contextUsers.length > 0) {
        setUsersList(contextUsers as ExtendedUser[]);
      }
    } catch {
      if (contextUsers && contextUsers.length > 0) {
        setUsersList(contextUsers as ExtendedUser[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await api.admin.toggleUser(userId);
      if (res.success && res.data?.user) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: res.data!.user.status } : u))
        );
      }
    } catch (e) {
      console.warn('Failed to toggle user status:', e);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser || amount <= 0) return;

    setIsAdjusting(true);
    try {
      const res = await api.admin.adjustWallet(adjustingUser.id, adjustType, amount, reason);
      if (res.success && res.data?.wallet) {
        const newBalance = res.data.wallet.availableBalance;
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === adjustingUser.id ? { ...u, walletBalance: newBalance } : u
          )
        );
      }
      setAdjustingUser(null);
    } catch (e) {
      console.warn('Failed to adjust wallet:', e);
    } finally {
      setIsAdjusting(false);
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Customer Directory ({usersList.length})</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time customer database synced directly with Cloud Supabase PostgreSQL. View live balances, toggle account status, and manage ledger credits.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLiveUsers}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Fetching Supabase...' : 'Refresh Customers'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search customers by name, email, or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl glass-panel border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-zinc-400 font-semibold border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Supabase Balance</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Registered On</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {isLoading && usersList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-400">
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-purple-400" />
                    <span>Loading customers from Supabase...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const balance = user.walletBalance ?? 0;

                  return (
                    <tr key={user.id} className="hover:bg-zinc-900/40 transition">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg ${
                              user.role === 'admin'
                                ? 'bg-purple-600 text-white'
                                : 'bg-blue-600 text-white'
                            } flex items-center justify-center font-bold text-xs`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{user.name}</span>
                            <span className="text-[10px] text-zinc-500">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-zinc-400">{user.id}</td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`capitalize font-semibold text-[11px] px-2 py-0.5 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                        ₹{balance.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-zinc-400 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setAdjustingUser(user)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-300 transition text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Adjust Balance</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Wallet Adjustment Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setAdjustingUser(null)}
          />
          <div className="relative w-full max-w-md bg-zinc-950 border border-purple-900/60 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Manual Wallet Adjustment</h3>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingUser(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-900 rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase font-semibold">
                Customer Account
              </span>
              <p className="text-xs font-bold text-white">{adjustingUser.name}</p>
              <p className="text-[11px] text-zinc-400 font-mono">{adjustingUser.email}</p>
              <p className="text-[11px] text-emerald-400 font-mono font-semibold pt-1">
                Current Balance: ₹{(adjustingUser.walletBalance ?? 0).toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADMIN_CREDIT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      adjustType === 'ADMIN_CREDIT'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Credit Balance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADMIN_DEBIT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      adjustType === 'ADMIN_DEBIT'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Debit Balance</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Audit Reason / Description
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Courtesy recharge, promotional grant..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting || amount <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-purple-600/30"
                >
                  {isAdjusting ? 'Processing Supabase...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
