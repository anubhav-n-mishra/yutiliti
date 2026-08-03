"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Moon, Sun, Wrench, MessageSquare, AlertTriangle, Mail, HelpCircle, ShieldCheck, Bot } from "lucide-react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenContact: (type: "request" | "feedback" | "bug") => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
  onOpenContact,
}: SettingsDrawerProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [notificationStatusText, setNotificationStatusText] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationStatusText("Push notifications are not supported in this browser.");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationStatusText("Push notifications are already active.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        setNotificationStatusText("Notifications enabled! You'll be notified when new tools release.");
        new Notification("Yuitility Notifications Active", {
          body: "You'll now receive alerts when new free browser tools land!",
          icon: "/icon.png",
        });
      } else {
        setNotificationsEnabled(false);
        setNotificationStatusText("Permission denied in browser settings.");
      }
    } catch {
      setNotificationStatusText("Could not request notification permission.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 h-full shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-y-auto font-sans"
        role="dialog"
        aria-label="Platform Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold">Settings & Preferences</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1">
          {/* Toggles Group */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Preferences
            </h3>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-bold">Dark Theme</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Switch color palette</p>
                </div>
              </div>
              <button
                onClick={onToggleDarkMode}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  darkMode ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">New Tool Notifications</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Get notified when new tools launch</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleNotifications}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    notificationsEnabled ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {notificationStatusText && (
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium pt-1">
                  {notificationStatusText}
                </p>
              )}
            </div>

            {/* YUI AI Assistant API Key Setup */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">YUI Assistant API Key (BYOK)</h4>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Add your custom API key for unlimited free queries with YUI.
              </p>
              <div className="space-y-2">
                <input
                  type="password"
                  value={localStorage.getItem("custom_ai_api_key") || ""}
                  onChange={(e) => {
                    localStorage.setItem("custom_ai_api_key", e.target.value);
                  }}
                  placeholder="Paste API Key (nvapi-...)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 font-mono"
                />
                <a
                  href="https://build.nvidia.com/explore/discover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Get free API Key →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Community & Support
            </h3>

            <button
              onClick={() => { onClose(); onOpenContact("request"); }}
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold">Request a Tool (24h SLA)</span>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenContact("feedback"); }}
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">Submit Feedback</span>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenContact("bug"); }}
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold">Report a Bug</span>
              </div>
            </button>

            <a
              href="mailto:hello@yuitility.app"
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold">Send Email (hello@yuitility.app)</span>
              </div>
            </a>

            <a
              href="mailto:support@yuitility.app"
              className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-semibold">Customer Support</span>
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% In-Browser Privacy Engine
          </div>
        </div>
      </div>
    </div>
  );
}
