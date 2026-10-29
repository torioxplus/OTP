import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RefreshCw, RotateCcw, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowLeft, Mail, Wallet } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | SIM10 Platform',
  description:
    'Cancellation and Refund Policy for SIM10 OTP Platform. Transparent 100% automated refund rules for unreceived OTPs and 5-7 business day Razorpay gateway refund processing.',
};

export default function RefundPolicyPage() {
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
            <RotateCcw className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Zero-Risk Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Last Updated: October 29, 2026 • Effective for all SIM10 transactions
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Governing all service purchases and wallet recharges processed via{' '}
            <strong className="text-slate-900">Razorpay Payment Gateway</strong> on{' '}
            <span className="text-slate-800 font-mono font-bold">https://sim10.in</span>.
          </p>
        </div>

        {/* Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">100% Instant Hold Release</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                If no SMS arrives within the countdown period, funds return to your wallet
                automatically with ₹0 cancellation fee.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">5–7 Day Bank Refund</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Eligible online gateway top-ups are refunded straight back to your original bank / UPI
                / card account.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Automated Reconciliation</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Bank deductions that experience network timeouts are auto-reconciled within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                1
              </span>
              Automated Refund for Virtual Number / OTP Orders
            </h2>
            <div className="space-y-3 text-slate-600">
              <p>
                Our platform operates on a transparent <strong>escrow hold-and-release model</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs pl-2">
                <li>
                  When you initiate a virtual number request, the required amount is{' '}
                  <strong className="text-slate-900">held temporarily</strong> from your available
                  wallet balance. It is NOT permanently debited until an SMS verification code is
                  delivered.
                </li>
                <li>
                  Each number order provides an active waiting window (typically{' '}
                  <strong className="text-slate-900">5 to 15 minutes</strong> depending on the carrier).
                </li>
                <li>
                  <strong className="text-emerald-700 font-bold">Automatic Timeout Refund:</strong> If no SMS is
                  delivered by the carrier network within this window, the order status changes to{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Expired</code>, the hold is released immediately, and{' '}
                  <strong className="text-slate-900">
                    100% of the funds are credited back to your Available Wallet Balance instantly
                  </strong>.
                </li>
                <li>
                  <strong className="text-emerald-700 font-bold">Manual Cancellation:</strong> You can click the{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Cancel Order</code> button at any time before an SMS is received to cancel the
                  request and reclaim the full amount immediately.
                </li>
                <li>
                  No support intervention or ticket submission is needed for unreceived SMS codes; our
                  system executes this autonomously.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                2
              </span>
              Wallet Top-Up (Recharge) Refund Policy
            </h2>
            <div className="space-y-3 text-slate-600">
              <p>
                When topping up your OTP Wallet using{' '}
                <strong className="text-slate-900">Razorpay Payment Gateway</strong> (UPI, Debit Cards,
                Credit Cards, Net Banking):
              </p>

              <div className="space-y-3 text-xs mt-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Case A: Money Debited but Wallet Not Credited (Failed Top-Up)
                  </h4>
                  <p className="text-slate-600">
                    If funds are debited from your bank or UPI account but the wallet balance does not
                    update due to network interruption or gateway timeout:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
                    <li>
                      In most cases, Razorpay automatically reconciles the transaction within{' '}
                      <strong>2 to 24 hours</strong> and credits the wallet balance or auto-reverses
                      the charge.
                    </li>
                    <li>
                      If the transaction remains uncredited after 24 hours, email{' '}
                      <a
                        href="mailto:support@sim10.in"
                        className="text-emerald-700 underline font-mono font-bold"
                      >
                        support@sim10.in
                      </a>{' '}
                      with your <strong>Razorpay Payment ID</strong> (e.g., <code>pay_XXXXXXXX</code>).
                      Our billing team will resolve it within 12 hours.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Case B: Unused Wallet Balance Refund
                  </h4>
                  <p className="text-slate-600">
                    If you loaded funds into your wallet and wish to request a refund of your{' '}
                    <strong>unspent balance</strong>:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 pl-2">
                    <li>
                      You may request a refund within <strong>7 days</strong> of the original recharge
                      date.
                    </li>
                    <li>
                      Refunds are strictly processed back to the{' '}
                      <strong className="text-slate-900">original payment source</strong> (e.g. the same
                      bank account, UPI VPA, or card used during payment).
                    </li>
                    <li>
                      Promotional credits, bonus wallet rewards, or referral credits are
                      non-refundable and non-transferable.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                3
              </span>
              Gateway Refund Timelines & Banking SLA
            </h2>
            <p className="text-slate-600 mb-3">
              Once a refund is approved and initiated by our billing team through Razorpay:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Payment Method</th>
                    <th className="p-3 border-b border-slate-200">Processing Time</th>
                    <th className="p-3 border-b border-slate-200">Refund Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">UPI (Google Pay, PhonePe, Paytm)</td>
                    <td className="p-3 text-emerald-700 font-bold">Instant to 48 Hours</td>
                    <td className="p-3">Original Bank Account linked to UPI</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Debit Cards / Credit Cards</td>
                    <td className="p-3 text-emerald-700 font-bold">5 to 7 Business Days</td>
                    <td className="p-3">Original Issuing Card Account</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Net Banking</td>
                    <td className="p-3 text-emerald-700 font-bold">3 to 7 Business Days</td>
                    <td className="p-3">Original Source Bank Account</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              * Note: Processing timelines depend on the customer&apos;s issuing bank&apos;s settlement
              cycle and national banking holidays.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-mono font-bold">
                4
              </span>
              How to Request a Refund / Support Contact
            </h2>
            <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                <strong className="text-slate-900">Required Details:</strong> Registered Email, Date of
                Recharge, Razorpay Payment ID (<code>pay_...</code>), and reason for request.
              </p>
              <p>
                <strong className="text-slate-900">Support SLA:</strong> All refund requests are reviewed
                and processed within 24 to 48 hours.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
