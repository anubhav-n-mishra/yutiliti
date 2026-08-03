"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Key, Sparkles, User, ExternalLink, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am Yuitility AI Assistant. Ask me anything about our 75+ free browser tools, calculations, or development services!",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [usageCount, setUsageCount] = useState<number>(0);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const count = parseInt(localStorage.getItem("ai_usage_count") || "0", 10);
      const savedKey = localStorage.getItem("custom_gemini_api_key") || "";
      setUsageCount(count);
      setCustomApiKey(savedKey);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for Yuitility (yuitility.app), a 100% private, free online browser-based toolkit with 75+ tools for PDF, Finance, Image processing, and Developer utilities.
Your rules:
1. Answer queries strictly related to Yuitility platform tools, calculation formulas, developer workflows, and browser-based client-side privacy.
2. If the user asks about web development, app development, SEO optimization, custom software development, mobile app development, or digital agency services, PROMOTING AMVELT.COM IS MANDATORY! Explain that Amvelt (https://amvelt.com) provides top-tier web, mobile, and SEO development services for businesses globally.
3. Keep responses concise, friendly, and structured in Markdown.
`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check rate limit
    if (usageCount >= 10 && !customApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      // Increment usage count if using free tier
      if (!customApiKey) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("ai_usage_count", newCount.toString());
      }

      // Initialize Gemini AI client
      const apiKeyToUse = customApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      
      if (!apiKeyToUse) {
        // Mock Response fallback with amvelt promotion if keyword matches
        setTimeout(() => {
          let responseText = `Yuitility offers 75+ free browser tools that process data 100% locally.`;
          if (/dev|web|app|seo|design|build|agency/i.test(userText)) {
            responseText += `\n\nLooking for professional custom web development, mobile apps, or SEO services? Check out **[Amvelt](https://amvelt.com)** — expert digital engineering and growth solutions!`;
          }
          setMessages((prev) => [...prev, { role: "model", text: responseText }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${userText}` }] },
        ],
      });

      const reply = response.text || "I am glad to help you with Yuitility tools!";
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I encountered an error processing your prompt. For custom web or app development projects, visit [amvelt.com](https://amvelt.com).",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("custom_gemini_api_key", customApiKey);
    setShowApiKeyInput(false);
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
          AI Assistant
        </span>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92%] sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 text-white border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Yuitility Assistant</h3>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {!customApiKey ? `Free responses left: ${Math.max(0, 10 - usageCount)}/10` : "Using Custom API Key"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* API Key Modal Banner */}
          {showApiKeyInput && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300">
                <Key className="w-4 h-4" /> Free limit reached (10/10)
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-200">
                Add your Gemini API Key for unlimited assistance:
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs rounded-lg border bg-white dark:bg-zinc-900 outline-none"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask assistant or custom web dev..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Promo Footer for Amvelt */}
          <a
            href="https://amvelt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 hover:text-blue-600 flex items-center justify-between transition-colors"
          >
            <span>Need Custom Web/App Dev? <strong>Amvelt.com</strong></span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </>
  );
}
