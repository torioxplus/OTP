import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Radio,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SIM10 Platform',
  description:
    'Learn about SIM10 OTP Platform — high-performance cloud telephony and automated virtual SMS verification engineered for developers, QA testers, and privacy-conscious users.',
};

export default function AboutPage() {
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
        <div className="border-b border-slate-200 pb-8 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold mb-4 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-[#0f172a] animate-pulse" />
            <span>About SIM10</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Next-Generation Cloud Telephony & SMS Verification
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed font-medium">
            Empowering developers, QA engineers, and digital businesses with instant, dependable
            virtual mobile numbers for software testing and verification across 200+ global platforms.
          </p>
        </div>

        {/* Mission & Story */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Our Mission</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Operating under the verified brand <strong>SIM10</strong>, our platform was
              engineered to solve a critical bottleneck faced by software developers, QA teams, and
              businesses: the need for reliable, rapid, and friction-free mobile number verification
              without risking personal privacy or purchasing expensive physical SIM cards.
            </p>
            <p className="text-slate-600 mt-4 leading-relaxed">
              We operate an intelligent aggregation network interfacing with premier tier-1 telecom
              aggregators globally. This ensures maximum delivery rates, millisecond-level routing,
              and 100% automated financial security for every user.
            </p>
          </section>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Sub-5s Delivery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our dynamic carrier routing continuously assesses line latency, ensuring inbound SMS
                codes are delivered to your screen in an average of 4.8 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Escrow Hold & Release</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero financial risk. If a telecom carrier fails to route an SMS within the active
                countdown window, 100% of the held funds are instantly refunded to your wallet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Global Coverage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access temporary numbers across multiple jurisdictions including India, the United
                States, the United Kingdom, Indonesia, Brazil, and more for 200+ digital platforms.
              </p>
            </div>
          </div>

          {/* Payment & Security Standards */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Payments, Safety & Compliance</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Security and transparency form the bedrock of our platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Razorpay Verified Integration</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  All customer payments are encrypted and processed through Razorpay with 3D Secure
                  multi-factor authentication and RBI compliance.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Data Privacy by Design</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We collect minimal personal data, do not store financial credentials, and comply
                  with the Digital Personal Data Protection Act (DPDP), 2023.
                </p>
              </div>
            </div>
          </section>

          {/* Corporate Details */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Corporate Details</h2>
            <div className="text-sm text-slate-700 space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed">
              <p>
                <strong className="text-slate-900">Operating Brand:</strong> SIM10 Platform
              </p>
              <p>
                <strong className="text-slate-900">Website:</strong>{' '}
                <span className="text-blue-700 font-mono font-bold">https://sim10.in</span>
              </p>
              <p>
                <strong className="text-slate-900">Corporate Support Email:</strong>{' '}
                <a
                  href="mailto:support@sim10.in"
                  className="text-blue-700 underline font-mono font-bold"
                >
                  support@sim10.in
                </a>
              </p>
              <p>
                <strong className="text-slate-900">Registered Office:</strong> SIM10 Platform, 2nd Floor,
                Patel Chambers, Near Station Road, Surat, Gujarat 395003, India
              </p>
            </div>
          </section>

          {/* CTA Banner with larger buttons */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl font-black">Ready to test virtual verification?</h3>
            <p className="text-sm text-blue-100 max-w-lg mx-auto font-medium">
              Create your account in seconds, top up your wallet securely via Razorpay, and get your
              first temporary number instantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard/buy-number"
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-lg"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-blue-900/60 hover:bg-blue-900 text-white border border-blue-400/40 text-sm font-bold transition"
              >
                <span>Contact Our Team</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
