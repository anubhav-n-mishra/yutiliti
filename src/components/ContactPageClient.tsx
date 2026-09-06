"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Header from "./Header";
import HoverFooter from "./ui/hover-footer";

export default function ContactPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"general" | "request" | "bug" | "partnership">("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type,
          subject: `[${type.toUpperCase()}] From ${name.trim()}`,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to deliver message. Please try emailing directly.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network connection error. Please email hello@yuitility.app directly.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col justify-between">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-24 flex-1 space-y-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Contact & Support</span>
        </nav>

        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Support & Inquiries
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-zinc-950 dark:text-white">
            Get in Touch with Yuitility
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Have questions about client-side privacy, want to request a new calculator, or found an issue? Our engineering team reviews every submission.
          </p>
        </div>

        {/* 2-Column Layout: Form + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            {status === "success" ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold font-display text-zinc-950 dark:text-white">Message Delivered</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out! Your message has been routed to our core engineers. We typically respond within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-type" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Inquiry Type
                  </label>
                  <select
                    id="contact-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  >
                    <option value="general">General Question</option>
                    <option value="request">Request a New Tool or Calculator</option>
                    <option value="bug">Report a Bug / Issue</option>
                    <option value="partnership">Custom Development / Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question, calculator formula feedback, or requested feature in detail..."
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none resize-y"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels & SLA */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Email Card */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6 shadow-sm">
              <h2 className="text-lg font-bold font-display text-zinc-950 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 dark:text-cyan-300" />
                Direct Channels
              </h2>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">General Inquiries</p>
                  <a href="mailto:hello@yuitility.app" className="font-semibold text-blue-600 dark:text-cyan-300 hover:underline text-sm">
                    hello@yuitility.app
                  </a>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Technical & Tool Support</p>
                  <a href="mailto:support@yuitility.app" className="font-semibold text-blue-600 dark:text-cyan-300 hover:underline text-sm">
                    support@yuitility.app
                  </a>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Engineering & Custom Solutions</p>
                  <a href="mailto:develop@yuitility.app" className="font-semibold text-blue-600 dark:text-cyan-300 hover:underline text-sm">
                    develop@yuitility.app
                  </a>
                </div>
              </div>
            </div>

            {/* SLA & Operating Hours */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Response Time SLA</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                    We review and reply to all user inquiries within <strong>24 business hours</strong>.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Engineering Studio</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                    Bengaluru, Karnataka, India · Operating globally 24/7 client-side.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Privacy Guarantee</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                    Your contact information is only used to respond to your specific request. Zero marketing lists, zero tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HoverFooter />
    </div>
  );
}
