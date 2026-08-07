"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Share2, MessageCircle, Twitter, Facebook, Linkedin, Send, Mail, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const target = url || window.location.href;
      setShareUrl(target);
      
      // Generate QR Code
      QRCode.toDataURL(target, { width: 200, margin: 1 })
        .then((dataUri) => setQrCodeDataUrl(dataUri))
        .catch(() => {});
    }
  }, [url, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Check out ${title} on Yuitility:`);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      color: "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 text-white hover:opacity-90",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800 text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-sky-500 hover:bg-sky-600 text-white",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-zinc-700 hover:bg-zinc-800 text-white",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: shareUrl,
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200 font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold">Share &quot;{title}&quot;</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Social Quick Share Grid */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
              Share via
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-2.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-center group"
                  >
                    <div className={`p-3 rounded-2xl ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 leading-tight">
                      {item.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Direct Copy Link Input */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Page Link
            </p>
            <div className="flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Toggle & Native Web Share */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              {showQrCode ? "Hide QR Code" : "Show QR Code"}
            </button>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                More options...
              </button>
            )}
          </div>

          {/* Expanded QR Code Display */}
          {showQrCode && qrCodeDataUrl && (
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-200">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-40 h-40 rounded-xl" />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">Scan with camera to open on mobile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
