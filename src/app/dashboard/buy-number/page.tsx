'use client';

import React, { useState, useEffect } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { ServiceIcon } from '@/components/ServiceIcon';
import { OtpCountdownTimer } from '@/components/OtpCountdownTimer';
import { RechargeModal } from '@/components/RechargeModal';
import {
  Search,
  Zap,
  Copy,
  Check,
  RefreshCw,
  XCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Plus,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyNumberPage() {
  const {
    services,
    countries,
    wallet,
    activeOrder,
    setActiveOrder,
    buyNumber,
    cancelOrder,
    simulateSmsReceived,
    isLoaded,
  } = usePlatform();

  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'srv_meesho');
  const [selectedOperator, setSelectedOperator] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  const selectedCountry =
    countries.find((c) => c.code === selectedCountryCode) || countries[0];
  const selectedService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter services by search and category
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      s.category === selectedCategory ||
      (selectedCategory === 'popular' && s.category === 'popular');
    return matchesSearch && matchesCategory;
  });

  const hasSufficientBalance = wallet.availableBalance >= (selectedService?.sellingPrice || 0);

  // Handle "Get Number"
  const handleGetNumber = async () => {
    if (!selectedService) return;
    setIsOrdering(true);
    setOrderError(null);

    // Simulate backend provider network negotiation
    await new Promise((res) => setTimeout(res, 900));

    const result = await buyNumber(selectedService.id, selectedCountry.code, selectedOperator);
    setIsOrdering(false);

    if (!result.success) {
      setOrderError(result.error || 'Failed to acquire number.');
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Handle Order Cancel & Hold Release
  const handleCancel = async () => {
    if (!activeOrder) return;
    const res = await cancelOrder(activeOrder.id);
    if (!res.success) {
      alert(res.message);
    }
  };

  // Auto-simulate OTP after 10 seconds for ultra-smooth paired testing
  useEffect(() => {
    if (activeOrder && activeOrder.status === 'WAITING_FOR_SMS') {
      const timer = setTimeout(() => {
        simulateSmsReceived(activeOrder.id);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
        });
      }, 10000); // arrive after 10 seconds automatically
      return () => clearTimeout(timer);
    }
  }, [activeOrder, simulateSmsReceived]);

  const categories = [
    { id: 'all', label: 'All Services', activeColor: 'bg-slate-900 text-white font-bold' },
    { id: 'popular', label: '🔥 Popular', activeColor: 'bg-amber-500 text-white font-bold' },
    { id: 'social', label: 'Social Media', activeColor: 'bg-pink-600 text-white font-bold' },
    { id: 'messaging', label: 'Messaging', activeColor: 'bg-blue-600 text-white font-bold' },
    { id: 'ai', label: 'AI & Tools', activeColor: 'bg-indigo-600 text-white font-bold' },
    { id: 'finance', label: 'Finance', activeColor: 'bg-blue-800 text-white font-bold' },
    { id: 'gaming', label: 'Gaming', activeColor: 'bg-purple-600 text-white font-bold' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buy Temporary Number</h1>
        <p className="text-xs text-slate-600 mt-1">
          Select a country and service to instantly reserve an active virtual number with 5-minute
          hold protection.
        </p>
      </div>

      {/* ACTIVE ORDER CARD (Section 15 & 17) */}
      {activeOrder && (
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-lg relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                <ServiceIcon name={activeOrder.serviceIcon} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{activeOrder.serviceName}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {activeOrder.countryFlag} {activeOrder.countryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mt-0.5">
                  <span>Order Ref: {activeOrder.id}</span>
                  <span>•</span>
                  <span>Provider: {activeOrder.providerName}</span>
                </div>
              </div>
            </div>

            {/* Status & Timer */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {activeOrder.status === 'WAITING_FOR_SMS' && (
                <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-slate-800 font-bold">
                  <OtpCountdownTimer expiresAt={activeOrder.websiteExpiresAt} />
                </div>
              )}

              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeOrder.status === 'WAITING_FOR_SMS'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : activeOrder.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {activeOrder.status === 'WAITING_FOR_SMS' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Waiting for SMS...</span>
                  </>
                ) : activeOrder.status === 'COMPLETED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SMS Received</span>
                  </>
                ) : (
                  <span>{activeOrder.status}</span>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Phone Number Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
            {/* Number Pill */}
            <div className="lg:col-span-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Assigned Phone Number
                </span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-wider">
                  {activeOrder.phoneNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeOrder.phoneNumber, 'number')}
                className="px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                {copiedText === 'number' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Hold & Fee Details */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-slate-600 block text-[10px] font-semibold">Price</span>
                <span className="font-black font-mono text-[#0f172a] text-sm">
                  ₹{activeOrder.sellingPrice.toFixed(2)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-slate-600 block text-[10px] font-semibold">Wallet Hold</span>
                <span className="font-black font-mono text-amber-700 text-sm">
                  {activeOrder.status === 'COMPLETED' ? 'Settled' : 'Active'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-slate-600 block text-[10px] font-semibold">Guarantee</span>
                <span className="font-black text-emerald-700 text-sm">Zero Risk</span>
              </div>
            </div>
          </div>

          {/* OTP / SMS Receiving Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            {activeOrder.smsReceived ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    SMS Message Arrived!
                  </span>
                  <span className="text-[11px] text-slate-600 font-semibold font-mono">
                    Sender: {activeOrder.smsReceived.sender}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-800 font-semibold font-sans leading-relaxed">
                      &ldquo;{activeOrder.smsReceived.message}&rdquo;
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Received at: {new Date(activeOrder.smsReceived.receivedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border-2 border-slate-200 shadow-xs shrink-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                        OTP Code
                      </span>
                      <span className="text-2xl font-mono font-extrabold text-slate-900 tracking-widest">
                        {activeOrder.smsReceived.otpCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(activeOrder.smsReceived!.otpCode, 'otp')}
                      className="p-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white transition shadow-sm cursor-pointer"
                      title="Copy OTP"
                    >
                      {copiedText === 'otp' ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Listening on provider network for incoming SMS...
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Enter the number above into {activeOrder.serviceName}. The OTP will appear here
                      instantly.
                    </p>
                  </div>
                </div>

                {/* Instant Simulation Test Trigger */}
                <button
                  type="button"
                  onClick={() => simulateSmsReceived(activeOrder.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Simulate SMS Arrival (Test)</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-4">
            <div className="flex items-center gap-2">
              {activeOrder.status === 'WAITING_FOR_SMS' && (
                <button
                  type="button"
                  onClick={() => {
                    alert('Checking provider order status... Order is active on carrier.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Again / Refresh</span>
                </button>
              )}

              {activeOrder.status === 'WAITING_FOR_SMS' && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Order & Refund ₹{activeOrder.sellingPrice}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveOrder(null)}
              className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold flex items-center gap-1.5 transition ml-auto cursor-pointer"
            >
              <span>+ Request Another Number</span>
            </button>
          </div>
        </div>
      )}

      {/* NUMBER PURCHASE CONFIGURATOR (Section 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filter & Service Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar: Country & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Country Selector */}
            <div className="sm:col-span-5 relative">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Select Country
              </label>
              <div className="relative">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition appearance-none cursor-pointer pr-10 shadow-xs"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Input */}
            <div className="sm:col-span-7">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Search Service or App
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. WhatsApp, OpenAI, Google..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Multi-Color) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? `${cat.activeColor} shadow-md`
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-50 border-[#0f172a] shadow-md ring-1 ring-[#0f172a]'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <ServiceIcon name={service.iconName} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          {service.name}
                        </h4>
                        <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
                          <span>~{service.avgSpeedSeconds}s</span>
                          <span>•</span>
                          <span className="text-[#0f172a] font-black">{service.successRate}%</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black font-mono text-[#0f172a] block">
                        ₹{service.sellingPrice.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span className="capitalize">{service.category}</span>
                    {isSelected && (
                      <span className="font-bold text-white flex items-center gap-1 bg-[#0f172a] px-2 py-0.5 rounded-md text-[11px]">
                        Selected <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600 font-semibold">No services match your search or filter.</p>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0f172a]" />
              Order Configuration
            </h3>

            {/* Selected Service & Country Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-semibold">Service:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ServiceIcon name={selectedService?.iconName || ''} className="w-3.5 h-3.5" />
                  {selectedService?.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-semibold">Country:</span>
                <span className="font-bold text-slate-900">
                  {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-semibold">Carrier Routing:</span>
                <span className="text-[#0f172a] font-bold text-xs bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-md">Smart Multi-Provider</span>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Selling Price:</span>
                <span className="text-2xl font-black font-mono text-[#0f172a]">
                  ₹{selectedService?.sellingPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Wallet Balance Check */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs sm:text-sm shadow-xs">
              <div>
                <span className="text-slate-600 block text-[11px] font-semibold">Your Wallet Balance</span>
                <span className="font-mono font-black text-base text-slate-900">
                  {!isLoaded ? (
                    <span className="inline-block w-16 h-4 bg-slate-200 animate-pulse rounded my-0.5" />
                  ) : (
                    `₹${wallet.availableBalance.toFixed(2)}`
                  )}
                </span>
              </div>

              {!hasSufficientBalance && (
                <button
                  type="button"
                  onClick={() => setIsRechargeOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Top Up
                </button>
              )}
            </div>

            {/* Error notice if any */}
            {orderError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Insufficient balance warning */}
            {!hasSufficientBalance && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="font-bold text-amber-900">Insufficient balance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRechargeOpen(true)}
                  className="underline font-bold text-[#0f172a] hover:text-slate-700 cursor-pointer"
                >
                  Add Funds
                </button>
              </div>
            )}

            {/* "GET NUMBER" BUTTON (Section 15 & 17) */}
            <button
              type="button"
              onClick={handleGetNumber}
              disabled={isOrdering || !hasSufficientBalance}
              className="w-full py-4 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isOrdering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Number with Provider...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Get Number (₹{selectedService?.sellingPrice.toFixed(0)})</span>
                </>
              )}
            </button>

            {/* Guarantee Info */}
            <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>5-minute countdown starts upon number assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0f172a]" />
                <span className="font-bold text-slate-900">Funds kept in HOLD; 100% refund if SMS is not received</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
}
