import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, Eye, Database, Server, UserCheck, ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SIM10 Platform',
  description:
    'Privacy Policy for SIM10 OTP Platform. Learn how we handle personal data, ensure DPDP Act compliance, and protect payment details processed securely through Razorpay.',
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Last Updated: October 29, 2026 • Compliant with DPDP Act, 2023 & IT Act, 2000
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Governing{' '}
            <span className="text-slate-800 font-mono font-bold">https://sim10.in</span> operated by{' '}
            <strong className="text-slate-900">SIM10 Platform</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                1
              </span>
              Overview & Commitment to Privacy
            </h2>
            <p className="text-slate-600">
              At <strong>SIM10</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
              operating <span className="text-emerald-700 font-bold">https://sim10.in</span>, we are
              committed to respecting and safeguarding the personal privacy of our users. This
              Privacy Policy outlines our practices regarding the collection, storage, use, and
              protection of your personal information in compliance with the{' '}
              <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong> and the{' '}
              <strong>Information Technology Act, 2000</strong> of India.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                2
              </span>
              Information We Collect
            </h2>
            <p className="text-slate-600 mb-4">
              We collect only the minimum necessary information required to deliver high-quality,
              secure verification services:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Account & Profile Data</span>
                </div>
                <p className="text-slate-600">
                  Full name, email address, hashed passwords, and contact preferences provided upon
                  registration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Order & Verification History</span>
                </div>
                <p className="text-slate-600">
                  Temporary numbers requested, timestamp of activation, service selected (e.g.
                  Telegram, Meesho), and verification SMS received.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Server className="w-4 h-4 text-purple-600" />
                  <span>Technical & Log Data</span>
                </div>
                <p className="text-slate-600">
                  IP address, browser type, operating system, and access timestamps to prevent
                  abuse, fraud, and unauthorized access.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Payment Metadata</span>
                </div>
                <p className="text-slate-600">
                  Razorpay Order ID, Payment ID, amount, currency (INR), and completion timestamp.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                3
              </span>
              Security of Payment Information (Razorpay Integration)
            </h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <strong>We NEVER store sensitive financial data.</strong> All payment processing for
                wallet top-ups on <span className="font-mono text-emerald-700 font-bold">sim10.in</span>{' '}
                is handled entirely by our authorized, licensed payment gateway partner:{' '}
                <strong className="text-slate-900">Razorpay Software Private Limited</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
                <li>
                  Your sensitive payment credentials (such as Credit/Debit card numbers, CVVs, UPI
                  PINs, and net banking passwords) are entered directly into Razorpay&apos;s
                  PCI-DSS Level 1 compliant secure checkout iframe.
                </li>
                <li>
                  Our servers only receive cryptographic success tokens, Razorpay payment reference
                  identifiers, and the payment amount to credit your wallet ledger.
                </li>
                <li>
                  All payment communications between your browser, our servers, and Razorpay are
                  encrypted via industry-standard 256-bit TLS/SSL encryption.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                4
              </span>
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
              <li>To provide, maintain, and dynamically route temporary SMS verification numbers.</li>
              <li>To maintain your wallet ledger, account balance, and financial transaction logs.</li>
              <li>To notify you of important service alerts, security notices, and receipt logs.</li>
              <li>To detect and prevent fraudulent use, bot attacks, and violations of our Terms.</li>
              <li>To comply with statutory legal obligations and regulatory standards in India.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                5
              </span>
              Data Sharing & Third-Party Disclosure
            </h2>
            <p className="text-slate-600">
              <strong>We do NOT sell, rent, or trade your personal data</strong> to advertisers or
              unaffiliated third parties.
            </p>
            <p className="text-slate-600 mt-2">
              We share data only with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 mt-2 pl-2">
              <li>
                <strong>Payment Aggregators (Razorpay):</strong> Strictly to authenticate and settle
                wallet recharges.
              </li>
              <li>
                <strong>Database & Infrastructure Providers:</strong> High-security cloud hosts
                subject to strict confidentiality agreements.
              </li>
              <li>
                <strong>Law Enforcement / Regulatory Authorities:</strong> Exclusively when mandated
                by a valid judicial order or applicable Indian laws.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold">
                6
              </span>
              Grievance Officer & Support Contact
            </h2>
            <p className="text-slate-600">
              In accordance with the Information Technology Act, 2000 and the Rules made thereunder,
              the details of the Grievance Redressal Desk are provided below:
            </p>
            <div className="mt-3 text-xs text-slate-700 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                <strong className="text-slate-900">Designation:</strong> Grievance Officer
              </p>
              <p>
                <strong className="text-slate-900">Platform:</strong> SIM10
              </p>
              <p>
                <strong className="text-slate-900">Postal Address:</strong> SIM10, 2nd Floor, Patel
                Chambers, Near Station Road, Surat, Gujarat 395003, India
              </p>
              <p>
                <strong className="text-slate-900">Official Support Email:</strong>{' '}
                <a
                  href="mailto:support@sim10.in"
                  className="text-emerald-700 underline font-mono font-bold"
                >
                  support@sim10.in
                </a>
              </p>
              <p>
                <strong className="text-slate-900">Response Time:</strong> Acknowledgment within 24
                hours; resolution within 7 working days.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
