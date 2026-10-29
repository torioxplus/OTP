import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shield, FileText, CheckCircle2, AlertTriangle, Scale, Lock, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SIM10 Platform',
  description:
    'Terms and Conditions of Service for SIM10 OTP Platform. Read our policies regarding account usage, digital verification, payments via Razorpay, and acceptable use.',
};

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Last Updated: October 29, 2026 • Effective Immediately
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Governing the use of{' '}
            <span className="text-slate-800 font-mono font-bold">https://sim10.in</span> and the services
            provided by <strong className="text-slate-900">SIM10</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                1
              </span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-600">
              Welcome to <strong>SIM10</strong> (operating the website{' '}
              <span className="text-emerald-700 font-bold">sim10.in</span> and associated virtual phone
              verification services, hereinafter referred to as &ldquo;the Platform&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
            </p>
            <p className="text-slate-600 mt-2">
              By registering an account, topping up your wallet, accessing, or using our services,
              you acknowledge that you have read, understood, and agreed to be legally bound by these
              Terms and Conditions and our Privacy Policy. If you do not agree with any part of these
              terms, you must immediately discontinue use of the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                2
              </span>
              Description of Services
            </h2>
            <p className="text-slate-600">
              SIM10 provides automated cloud virtual telephone numbers and SMS verification
              routing services designed for software testing, quality assurance (QA), digital app
              demonstrations, and user privacy protection.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-600 pl-2">
              <li>
                Virtual numbers are provided on a temporary, single-use activation basis.
              </li>
              <li>
                Numbers are allocated dynamically from global telecom carrier pools.
              </li>
              <li>
                Once a verification code (SMS/OTP) is successfully delivered to your dashboard, the
                activation session for that specific transaction is deemed fulfilled.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                3
              </span>
              User Registration & Account Responsibilities
            </h2>
            <p className="text-slate-600">
              To utilize the services, you must register for an account with a valid email address
              and maintain the confidentiality of your credentials.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Eligibility</h4>
                <p className="text-slate-600">
                  You must be at least 18 years of age or possess legal capacity in your jurisdiction
                  to enter into binding contracts.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Account Security</h4>
                <p className="text-slate-600">
                  You are solely responsible for all activities and transactions executed under your
                  account credentials.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-700 text-xs font-mono font-bold">
                4
              </span>
              Strict Prohibited Uses & Anti-Fraud Policy
            </h2>
            <p className="text-slate-600">
              Our platform operates strictly for legitimate testing and privacy protection. You
              expressly agree NOT to use SIM10 services for:
            </p>
            <div className="space-y-2 mt-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Any financial fraud, banking identity theft, unauthorized credit card operations,
                  or bypassing KYC/AML checks.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Illegal spamming, harassment, phishing, cyberstalking, or transmitting malicious code.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Any activity that violates the Information Technology Act, 2000, Indian Penal Code,
                  or applicable telecom regulations.
                </span>
              </div>
            </div>
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
              <strong>Zero-Tolerance Enforcement:</strong> Any account detected participating in
              prohibited or fraudulent behavior will be terminated immediately, wallet balance
              forfeited, and appropriate details reported to competent law enforcement agencies.
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                5
              </span>
              Pricing, Wallet & Razorpay Payment Terms
            </h2>
            <div className="space-y-3 text-slate-600">
              <p>
                <strong>Currency:</strong> All prices, wallet top-ups, and service charges are
                denominated in Indian National Rupees (INR / ₹) including applicable taxes.
              </p>
              <p>
                <strong>Pre-funded Wallet Model:</strong> Services are deducted directly from your
                pre-funded wallet balance. When you request a number, the service cost is held in
                escrow. If no SMS arrives within the 5 to 15-minute validity window, the hold is
                automatically released, and 100% of the funds return to your available balance.
              </p>
              <p>
                <strong>Payment Gateway Processing:</strong> All online payments (UPI, Credit Cards,
                Debit Cards, Net Banking) are securely processed through our authorized payment
                gateway partner <strong>Razorpay Software Private Limited</strong>. SIM10 does
                not store or have access to your sensitive payment credentials (such as card numbers,
                CVVs, or UPI PINs). All financial processing complies with RBI guidelines and PCI-DSS
                Level 1 standards.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                6
              </span>
              Refunds and Cancellations
            </h2>
            <p className="text-slate-600">
              Our comprehensive Refund and Cancellation Policy is fully integrated into these terms.
              Please review our dedicated{' '}
              <Link href="/refund-policy" className="text-emerald-700 underline font-bold">
                Cancellation & Refund Policy
              </Link>{' '}
              for complete details regarding automated wallet credits and banking refund timelines.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                7
              </span>
              Governing Law and Dispute Resolution
            </h2>
            <p className="text-slate-600">
              These Terms and Conditions shall be governed by and construed in accordance with the
              laws of the Republic of India. In the event of any claim, controversy, or dispute
              arising out of or related to these terms or our services, the courts located in Gujarat,
              India shall possess exclusive jurisdiction.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                8
              </span>
              Contact Information
            </h2>
            <p className="text-slate-600">
              For any legal notices, questions, or clarifications regarding these Terms and
              Conditions, please contact us:
            </p>
            <div className="mt-3 text-xs text-slate-700 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                <strong className="text-slate-900">Business Entity:</strong> SIM10 Platform
              </p>
              <p>
                <strong className="text-slate-900">Official Website:</strong>{' '}
                <span className="font-mono text-emerald-700 font-bold">https://sim10.in</span>
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
                <strong className="text-slate-900">Support Operating Hours:</strong> Monday – Saturday,
                9:00 AM – 7:00 PM IST
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
