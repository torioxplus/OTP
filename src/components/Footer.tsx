import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ShieldCheck, CheckCircle2, Lock, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white pt-14 pb-10 mt-auto text-slate-700 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 lg:col-span-2">
            <Logo href="/" size="md" />
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Enterprise-grade virtual numbers and automated SMS verification for software testing,
              developer QA, and privacy protection across 200+ global platforms. Instant digital
              delivery under 10 seconds.
            </p>

            <div className="space-y-2 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-900 shrink-0" />
                <a
                  href="mailto:support@sim10.in"
                  className="hover:text-[#0f172a] transition font-mono font-bold text-slate-900"
                >
                  support@sim10.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-900 shrink-0" />
                <a
                  href="tel:+919106284931"
                  className="hover:text-[#0f172a] transition font-mono font-bold text-slate-900"
                >
                  +91 91062 84931
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Surat, Gujarat 395003, India</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg w-fit">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Systems Operational (99.98%)</span>
            </div>
          </div>

          {/* Col 2: Popular Services */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Popular Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 font-semibold">
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  Meesho Temporary Numbers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  Telegram Verification OTP
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  OpenAI & ChatGPT Verification
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  Google & Gmail Virtual SMS
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  Instagram & TikTok Numbers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Navigation */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#0f172a] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0f172a] transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard/overview" className="hover:text-[#0f172a] transition">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard/buy-number" className="hover:text-[#0f172a] transition">
                  Buy Temporary Number
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wallet" className="hover:text-[#0f172a] transition">
                  Wallet & Ledger
                </Link>
              </li>
              <li>
                <Link href="/dashboard/activations" className="hover:text-[#0f172a] transition">
                  Order History & Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandatory Legal & Compliance for Razorpay */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 font-semibold">
              <li>
                <Link href="/terms" className="hover:text-[#0f172a] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0f172a] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#0f172a] transition">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#0f172a] transition">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0f172a] transition">
                  Help Desk & Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0f172a] transition">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Razorpay Trust & Payment Assurance Bar */}
        <div className="pt-8 pb-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-900 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                100% Secure Payments
              </span>
              <span className="text-xs text-slate-500">
                Powered by Razorpay (UPI, RuPay, Cards, NetBanking)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                256-Bit SSL Security
              </span>
              <span className="text-xs text-slate-500">
                PCI-DSS Level 1 Encrypted Financial Transactions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                Zero-Risk Escrow Guarantee
              </span>
              <span className="text-xs text-slate-500">
                Instant 100% wallet refund if OTP is not received
              </span>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SIM10 Platform. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium text-slate-600">
            <Link href="/terms" className="hover:text-slate-900 transition">
              Terms
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/privacy" className="hover:text-slate-900 transition">
              Privacy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/refund-policy" className="hover:text-slate-900 transition">
              Refunds
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/shipping-policy" className="hover:text-slate-900 transition">
              Shipping & Delivery
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="hover:text-slate-900 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
