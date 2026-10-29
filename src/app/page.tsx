'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceIcon } from '@/components/ServiceIcon';
import { usePlatform } from '@/context/PlatformContext';
import {
  Radio,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Globe,
  Sparkles,
  ChevronRight,
  Lock,
  Layers,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  const { services, countries, openAuthModal } = usePlatform();
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('meesho');
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');

  const selectedService =
    services.find((s) => s.slug === selectedServiceSlug) || services[0];
  const selectedCountry =
    countries.find((c) => c.code === selectedCountryCode) || countries[0];

  const popularServices = services.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 shadow-2xs">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#0f172a] animate-pulse" />
                <span className="text-xs font-bold text-slate-800 tracking-wide">
                  Multi-Provider Carrier Network
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Instant Virtual Numbers for{' '}
                <span className="text-[#0f172a] underline decoration-slate-300">SMS & OTP</span> Verification
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Activate accounts on Meesho, Telegram, OpenAI, Google and 200+ services in seconds.
                Zero-risk wallet reservation with automatic refunds if SMS is not received.
              </p>

              {/* Action Buttons (Prominent size & bold typography) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard/buy-number"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-base transition flex items-center justify-center gap-2.5 shadow-sm group cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Get Temporary Number</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-200 font-bold text-base transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Try Demo Account</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-slate-900 font-mono">4.8s</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Avg OTP Speed</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-slate-900 font-mono">99.4%</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Delivery Rate</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-amber-700 font-mono">₹0 Risk</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Auto Hold Release</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-[#0f172a] font-mono">200+</div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">Supported Apps</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Demo Card */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-7 rounded-2xl bg-white border-2 border-slate-200 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Live Number Generator
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                    Instant Demo
                  </span>
                </div>

                <div className="py-5 space-y-4">
                  {/* Country Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      1. Choose Country
                    </label>
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 transition cursor-pointer shadow-xs"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      2. Choose Platform / Service
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {services.slice(0, 4).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedServiceSlug(s.slug)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border-2 text-xs font-bold transition cursor-pointer ${
                            selectedServiceSlug === s.slug
                              ? 'bg-slate-50 border-[#0f172a] text-[#0f172a] shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ServiceIcon name={s.iconName} className="w-4 h-4 text-slate-700" />
                            <span className="truncate">{s.name.split('/')[0]}</span>
                          </div>
                          <span className="font-mono text-[#0f172a] font-black">
                            ₹{s.sellingPrice}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600 font-semibold">Guaranteed Selling Price:</span>
                      <span className="text-lg font-black text-[#0f172a] font-mono">
                        ₹{selectedService.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600 font-semibold">Activation Window:</span>
                      <span className="text-amber-800 font-bold">5 Minutes Countdown</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600 font-semibold">Refund Guarantee:</span>
                      <span className="text-emerald-800 font-bold">100% Release if No SMS</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href="/dashboard/buy-number"
                    className="w-full py-3.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Get {selectedService.name} Number</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[11px] text-slate-600 text-center font-medium">
                    Instant delivery • Temporary 1-time virtual verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
              Simple 4-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              How the OTP Wallet Platform Works
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Every step is managed with financial ledger integrity and automatic risk protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white font-black flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Add Wallet Balance</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Deposit funds via instant UPI, QR code, or Razorpay. Balance is immediately
                credited to your ledger.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white font-black flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Choose Service</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Select from Meesho, Telegram, Google, etc. Our backend calculates transparent
                selling prices with guaranteed margins.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">5-Min Hold Timer</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Funds are put on hold (not permanently charged). You get a fresh temporary number
                and a 5-minute countdown window.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mb-4 shadow-sm">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Receive OTP or Refund</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                SMS arrives within seconds. If no SMS arrives or you cancel within the window, the
                hold is instantly released!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Popular Verification Services</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Real-time provider routing with high delivery success rates.
              </p>
            </div>
            <Link
              href="/dashboard/buy-number"
              className="text-xs font-bold text-[#0f172a] hover:underline flex items-center gap-1"
            >
              <span>View All 200+ Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-xl bg-white border-2 border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700">
                      <ServiceIcon name={service.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono font-black text-[#0f172a] bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-300">
                      ₹{service.sellingPrice.toFixed(2)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{service.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold mt-1">
                    <span>Speed: ~{service.avgSpeedSeconds}s</span>
                    <span>•</span>
                    <span className="text-[#0f172a] font-bold">{service.successRate}% Success</span>
                  </div>
                </div>

                <Link
                  href="/dashboard/buy-number"
                  className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] font-bold text-xs text-white transition text-center shadow-xs"
                >
                  Activate Number
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Safeguards */}
      <section className="py-16 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
              Engineering Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Enterprise Telecom & Wallet Technology
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Designed for financial precision, multi-provider resiliency, and full transaction
              transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Double-Entry Wallet Ledger</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Balances are tracked via explicit ledger transactions (RECHARGE, HOLD, DEBIT,
                RELEASE_HOLD, REFUND). Zero direct unsafe balance mutations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Multi-Provider Adapter Network</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Standardized provider interfaces for TigerSMS, GrizzlySMS, 5SIM, and OnlineSIM with
                sub-second carrier routing and automated price margin enforcement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Escrow Hold & Margin Safety</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Selling prices are calculated server-side with strict margin enforcement. If an SMS
                fails to arrive within 5 minutes, 100% of held funds are automatically released.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
              Ready to Activate Your Virtual Number?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 font-medium">
              Create an account or start with our interactive demo. Top up ₹50+ securely via
              Razorpay and get instant access to numbers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/buy-number"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-base transition shadow-lg cursor-pointer"
              >
                Start Verification
              </Link>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-base transition cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
