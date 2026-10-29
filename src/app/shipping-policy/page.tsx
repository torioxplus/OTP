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
        <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Digital Virtual Service</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Electronic Delivery &lt; 10s</h3>
            <p className="text-xs text-slate-600 max-w-xl font-medium">
              All services provided on sim10.in are delivered digitally and instantaneously
              through your authenticated web dashboard. No physical shipment or courier dispatch is
              involved.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 font-mono font-bold shrink-0">
            Avg Speed: <span className="text-emerald-700 font-black">4.8 Seconds</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                1
              </span>
              Nature of Products & Services
            </h2>
            <p className="text-slate-600">
              <strong>SIM10</strong> specializes exclusively in cloud-based virtual
              telecommunication services, temporary phone number routing, and automated SMS
              verification for developer QA, privacy testing, and online service verification.
            </p>
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
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
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                2
              </span>
              Fulfillment Method & Timelines
            </h2>
            <p className="text-slate-600 mb-4">
              Our automated delivery infrastructure ensures near-instantaneous fulfillment across all
              service tiers:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Virtual Numbers</span>
                </div>
                <p className="text-slate-600">
                  Allocated and displayed in your browser within{' '}
                  <strong className="text-emerald-700 font-bold">2 to 8 seconds</strong> after clicking &ldquo;Get
                  Number&rdquo;.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>SMS Verification Code</span>
                </div>
                <p className="text-slate-600">
                  Delivered programmatically to your active order screen in real-time as soon as the
                  telecom carrier relays the inbound code.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  <span>Wallet Credits (Razorpay)</span>
                </div>
                <p className="text-slate-600">
                  Wallet top-up balances are updated{' '}
                  <strong className="text-purple-700 font-bold">instantaneously (&lt; 5 seconds)</strong> upon
                  webhook confirmation from Razorpay.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                3
              </span>
              Support Desk & Inquiries
            </h2>
            <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
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
