'use client';

import React, { useState, useEffect } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { api } from '@/lib/api';
import { User } from '@/types';
import {
  Users,
  Search,
  Wallet,
  DollarSign,
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
  
  // Fast initial hydration from client cache
  const cachedUsers = api.cache.get<{ users: User[] }>('/admin/users')?.data?.users;
  const [usersList, setUsersList] = useState<ExtendedUser[]>(
    (cachedUsers || (contextUsers && contextUsers.length > 0 ? contextUsers : [])) as ExtendedUser[]
  );
  const [isLoading, setIsLoading] = useState(!cachedUsers && (!contextUsers || contextUsers.length === 0));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [adjustingUser, setAdjustingUser] = useState<ExtendedUser | null>(null);

  // Adjustment form states
  const [adjustType, setAdjustType] = useState<'ADMIN_CREDIT' | 'ADMIN_DEBIT'>('ADMIN_CREDIT');
  const [amount, setAmount] = useState<number>(100);
  const [reason, setReason] = useState<string>('Courtesy credit adjustment');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchLiveUsers = async (force: boolean = false) => {
    if (force) setIsRefreshing(true);
    try {
      const res = await api.admin.getUsers({ force });
      if (res.success && res.data?.users) {
        setUsersList(res.data.users as ExtendedUser[]);
      } else if (contextUsers && contextUsers.length > 0 && usersList.length === 0) {
        setUsersList(contextUsers as ExtendedUser[]);
      }
    } catch {
      if (contextUsers && contextUsers.length > 0 && usersList.length === 0) {
        setUsersList(contextUsers as ExtendedUser[]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers(false);
    // Subscribe to cache updates
    const unsubscribe = api.cache.subscribe<{ users: User[] }>('/admin/users', (cached) => {
      if (cached?.users) {
        setUsersList(cached.users as ExtendedUser[]);
      }
    });
    return () => {
      unsubscribe();
    };
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
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-slate-800" />
            <span>Customer Directory ({usersList.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Customer database synced directly with Supabase. View live balances, toggle account status, and manage ledger credits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchLiveUsers(true)}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Fetching Supabase...' : 'Refresh Customers'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search customers by name, email, or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#0f172a] transition shadow-2xs font-medium"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Registered On</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && usersList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                    <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-slate-800" />
                    <span>Loading customers...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const balance = user.walletBalance ?? 0;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg ${
                              user.role === 'admin'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-800 text-white'
                            } flex items-center justify-center font-bold text-xs shadow-2xs`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            <span className="text-[11px] text-slate-500 font-medium">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-500 font-medium">{user.id}</td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`capitalize font-bold text-[11px] px-2 py-0.5 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-slate-100 text-slate-900 border border-slate-300'
                              : 'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">
                        ₹{balance.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 font-medium text-[11px]">
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
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition text-xs font-bold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setAdjustingUser(null)}
          />
          <div className="relative w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-bold text-slate-900">Manual Wallet Adjustment</h3>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingUser(null)}
                className="text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                Customer Account
              </span>
              <p className="text-xs font-bold text-slate-900">{adjustingUser.name}</p>
              <p className="text-[11px] text-slate-500 font-mono font-medium">{adjustingUser.email}</p>
              <p className="text-[11px] text-emerald-700 font-mono font-bold pt-1">
                Current Balance: ₹{(adjustingUser.walletBalance ?? 0).toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADMIN_CREDIT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      adjustType === 'ADMIN_CREDIT'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Credit Balance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADMIN_DEBIT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      adjustType === 'ADMIN_DEBIT'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Debit Balance</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0f172a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Audit Reason / Description
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Courtesy recharge, promotional grant..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0f172a]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting || amount <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-50 text-xs font-bold text-white shadow-sm cursor-pointer"
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
