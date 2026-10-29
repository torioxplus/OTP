import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Zap, Send, ShieldCheck, CheckCircle2, Clock, Globe, ArrowLeft, Mail, FileCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | SIM10 Platform',
  description:
    'Shipping and Delivery Policy for SIM10 OTP Platform. Details our 100% instant digital delivery, zero physical shipping, and automated fulfillment SLA.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold mb-4 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Digital Fulfillment SLA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Last Updated: October 29, 2026 • Standard Electronic Delivery Protocol
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Applicable to all digital virtual services and wallet recharges conducted on{' '}
            <span className="text-slate-800 font-mono font-bold">https://sim10.in</span> operated by{' '}
            <strong className="text-slate-900">SIM10 Platform</strong>.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-emerald-200 shadow-xs mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Digital Virtual Service</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Instant Electronic Delivery &lt; 10s</h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed font-medium">
              All services provided on sim10.in are delivered digitally and instantaneously
              through your authenticated web dashboard. No physical shipment or courier dispatch is
              involved.
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-mono font-bold shrink-0">
            Avg Speed: <span className="text-emerald-700 font-black">4.8 Seconds</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold shrink-0">
                1
              </span>
              <span>Nature of Products & Services</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>SIM10</strong> specializes exclusively in cloud-based virtual
              telecommunication services, temporary phone number routing, and automated SMS
              verification for developer QA, privacy testing, and online service verification.
            </p>
            <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
              <strong className="text-slate-900">Notice of Digital Delivery:</strong> We do not sell or
              ship physical SIM cards, mobile handsets, or hardware devices. Consequently, there are{' '}
              <strong className="text-emerald-700 font-bold">
                no shipping fees, courier charges, customs tariffs, or physical delivery transit
                times
              </strong>{' '}
              associated with any purchases made on this website.
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold shrink-0">
                2
              </span>
              <span>Fulfillment Method & Timelines</span>
            </h2>
            <p className="text-slate-600 mb-5 leading-relaxed">
              Our automated delivery infrastructure ensures near-instantaneous fulfillment across all
              service tiers:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Virtual Numbers</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Allocated and displayed in your browser within{' '}
                  <strong className="text-emerald-700 font-bold">2 to 8 seconds</strong> after clicking &ldquo;Get
                  Number&rdquo;.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Send className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>SMS Verification Code</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Delivered programmatically to your active order screen in real-time as soon as the
                  telecom carrier relays the inbound code.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Wallet Credits (Razorpay)</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Wallet top-up balances are updated{' '}
                  <strong className="text-purple-700 font-bold">instantaneously (&lt; 5 seconds)</strong> upon
                  webhook confirmation from Razorpay.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold shrink-0">
                3
              </span>
              <span>Support Desk & Inquiries</span>
            </h2>
            <div className="text-sm text-slate-700 space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed">
              <p>
                <strong className="text-slate-900">Business Entity:</strong> SIM10 Platform
              </p>
              <p>
                <strong className="text-slate-900">Technical Support Desk:</strong>{' '}
                <a
                  href="mailto:support@sim10.in"
                  className="text-emerald-700 underline font-mono font-bold"
                >
                  support@sim10.in
                </a>
              </p>
              <p>
                <strong className="text-slate-900">Operational Turnaround:</strong> Inquiries are answered
                within 12 to 24 hours.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
