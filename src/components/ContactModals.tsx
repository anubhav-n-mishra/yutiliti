"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Wrench, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { TOOLS } from "@/src/types";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "request" | "feedback" | "bug";
}

export default function ContactModal({ isOpen, onClose, initialType = "request" }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<"request" | "feedback" | "bug">(initialType);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedToolId, setSelectedToolId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setActiveTab(initialType);
    setIsSubmitted(false);
    setErrorMsg("");
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setErrorMsg("Please fill in all required fields (Email and Message).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          name,
          email,
          message,
          toolId: selectedToolId || undefined,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to send. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold">Contact & Community</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-2 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 flex gap-1">
          <button
            onClick={() => { setActiveTab("request"); setIsSubmitted(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "request"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Request Tool
          </button>
          <button
            onClick={() => { setActiveTab("feedback"); setIsSubmitted(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "feedback"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Feedback
          </button>
          <button
            onClick={() => { setActiveTab("bug"); setIsSubmitted(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "bug"
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Report Bug
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {activeTab === "request"
                  ? "Tool Request Received!"
                  : activeTab === "bug"
                  ? "Bug Report Submitted"
                  : "Feedback Received!"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {activeTab === "request"
                  ? "Thank you! We review tool requests constantly and aim to add popular utility tools within 24 hours."
                  : "We have received your message and sent a confirmation email to your inbox."}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "request" && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl text-xs text-blue-700 dark:text-blue-300">
                  <p className="font-bold">⚡ 24-Hour Addition Promise</p>
                  <p className="mt-0.5 opacity-90">Describe the calculator or browser utility you need. We review and build requested tools within 24 hours!</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Your Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {activeTab === "bug" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Affected Tool (Optional)</label>
                  <select
                    value={selectedToolId}
                    onChange={(e) => setSelectedToolId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                  >
                    <option value="">-- General / Entire Site --</option>
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {activeTab === "request"
                    ? "Tool Description & Functionality"
                    : activeTab === "bug"
                    ? "Describe the issue or error"
                    : "Your Feedback or Suggestions"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    activeTab === "request"
                      ? "e.g., A CSV to JSON converter tool with custom key mapping..."
                      : activeTab === "bug"
                      ? "e.g., When I upload a 5MB image on Image Compressor, the progress bar hangs..."
                      : "Share your thoughts on how we can improve Yuitility..."
                  }
                  className="w-full p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Submission
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
