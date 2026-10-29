'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  Headphones,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payment / Wallet Recharge');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 selection:bg-slate-900 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold mb-4 shadow-2xs">
            <Headphones className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Customer Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Support & Office
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Have questions about your wallet balance, payment confirmation, or carrier SMS
            delivery? Our dedicated support team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Business Information</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  SIM10 operates the verified platform{' '}
                  <span className="text-blue-700 font-mono font-bold">sim10.in</span>.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                {/* Email */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                      Official Support Email
                    </span>
                    <a
                      href="mailto:support@sim10.in"
                      className="font-bold text-slate-900 hover:text-blue-700 transition font-mono text-sm block"
                    >
                      support@sim10.in
                    </a>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      Average response: &lt; 12 hours
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                      Customer Support Helpline
                    </span>
                    <a
                      href="tel:+919106284931"
                      className="font-bold text-slate-900 hover:text-blue-700 transition font-mono text-sm block"
                    >
                      +91 91062 84931
                    </a>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      Voice Support: Mon–Sat, 9:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>

                {/* Operating Address */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                      Registered & Operating Office
                    </span>
                    <p className="font-semibold text-slate-800 leading-relaxed text-xs sm:text-sm pt-0.5">
                      SIM10 Platform, 2nd Floor, Patel Chambers,
                      <br />
                      Near Station Road, Surat,
                      <br />
                      Gujarat 395003, India
                    </p>
                  </div>
                </div>

                {/* Hours - Spaced Out & Clean */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">
                      Operating Working Hours
                    </span>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm leading-normal">
                      Monday to Saturday: 9:00 AM – 7:00 PM IST
                    </p>
                    <p className="text-slate-600 text-xs font-medium leading-normal">
                      Sunday: 10:00 AM – 2:00 PM IST
                    </p>
                    <div className="pt-1.5 border-t border-slate-200/70">
                      <p className="text-emerald-700 text-xs font-bold leading-normal">
                        Automated OTP Routing & Wallet System: 24/7/365
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 space-y-2 mt-4">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs sm:text-sm">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>Verified Razorpay Merchant</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Payments are authenticated securely via Razorpay Payment Gateway with RBI-compliant
                  multi-factor security.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Message / Query Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">Send Us a Message</h2>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Fill in your details below and our customer support team will reply directly to your
                email inbox.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Message Received Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                    Thank you for contacting SIM10 support. A representative has been assigned to
                    your inquiry and will respond to your registered email address within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      >
                        <option value="Payment / Wallet Recharge">Payment / Wallet Recharge</option>
                        <option value="Refund & Cancellation">Refund & Cancellation</option>
                        <option value="OTP / SMS Delivery">OTP / SMS Delivery</option>
                        <option value="Account & Login">Account & Login</option>
                        <option value="API & Developer Integration">API & Developer Integration</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Subject / Payment ID
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Razorpay Payment pay_XXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Message / Detailed Description *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center pt-2 font-medium">
                    Our support team typically reviews and replies to all messages within 12 to 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
