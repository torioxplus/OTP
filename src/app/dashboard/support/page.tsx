'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { TicketCategory } from '@/types';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  User,
  Shield,
} from 'lucide-react';

export default function SupportPage() {
  const { tickets, createTicket, replyTicket, currentUser } = usePlatform();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('OTP Delivery');
  const [message, setMessage] = useState('');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    createTicket(subject, category, message);
    setSubject('');
    setMessage('');
    setIsNewTicketOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    replyTicket(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support & Help Desk</h1>
          <p className="text-xs text-slate-600 mt-1">
            Need help with a verification code, wallet top-up, or provider inquiry?
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewTicketOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (Left) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Tickets</h3>

          {tickets.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 font-medium shadow-xs">
              No tickets open.
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    activeTicket?.id === t.id
                      ? 'bg-slate-50 border-[#0f172a] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-slate-500 font-bold">{t.id}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium mt-2">
                    <span>{t.category}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Conversation (Right) */}
        <div className="lg:col-span-8">
          {activeTicket ? (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col h-[520px]">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeTicket.subject}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium mt-0.5">
                    <span>Category: {activeTicket.category}</span>
                    <span>•</span>
                    <span className="font-mono font-bold">ID: {activeTicket.id}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    activeTicket.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {activeTicket.status.replace('_', ' ')}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Initial Ticket Message */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">You</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(activeTicket.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 border border-slate-200 text-xs text-slate-900 font-medium leading-relaxed">
                      {activeTicket.message}
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {activeTicket.replies.map((reply) => {
                  const isAdmin = reply.sender === 'admin';
                  return (
                    <div
                      key={reply.id}
                      className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isAdmin ? 'bg-slate-900 text-white' : 'bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className={`space-y-1 max-w-lg ${isAdmin ? 'items-end text-right' : ''}`}>
                        <div
                          className={`flex items-center gap-2 ${
                            isAdmin ? 'justify-end' : ''
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900">
                            {reply.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {new Date(reply.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                            isAdmin
                              ? 'bg-[#0f172a] text-white rounded-tr-none text-left shadow-xs'
                              : 'bg-slate-100 border border-slate-200 text-slate-900 rounded-tl-none'
                          }`}
                        >
                          {reply.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message to support..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-slate-500 text-xs font-medium">
              Select a ticket to view replies.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:border-slate-900 cursor-pointer"
                >
                  <option value="OTP Delivery">OTP Delivery & Reception</option>
                  <option value="Wallet & Recharge">Wallet & Recharge</option>
                  <option value="Order Refund">Order Cancellation & Refund</option>
                  <option value="API Integration">Developer API</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WhatsApp verification not receiving code"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue with order number or service name..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-slate-900 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold transition cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
