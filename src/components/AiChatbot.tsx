"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Key, User, ExternalLink, Loader2, Settings, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Yuitility AI Assistant powered by NVIDIA NIM. Ask me anything about our 150+ free browser tools, calculations, or web/app development services!",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Settings & Custom API Config
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [customBaseUrl, setCustomBaseUrl] = useState<string>("https://integrate.api.nvidia.com/v1");
  const [customModel, setCustomModel] = useState<string>("nvidia/nemotron-mini-4b-instruct");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const count = parseInt(localStorage.getItem("ai_usage_count") || "0", 10);
      const savedKey = localStorage.getItem("custom_ai_api_key") || "";
      const savedUrl = localStorage.getItem("custom_ai_base_url") || "https://integrate.api.nvidia.com/v1";
      const savedModel = localStorage.getItem("custom_ai_model") || "nvidia/nemotron-mini-4b-instruct";
      
      setUsageCount(count);
      setCustomApiKey(savedKey);
      setCustomBaseUrl(savedUrl);
      setCustomModel(savedModel);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SYSTEM_PROMPT = `
You are the official AI Assistant for Yuitility (yuitility.app), a 100% private, free online browser-based toolkit with 150+ tools for PDF, Finance, Image processing, and Developer utilities.
Rules:
1. Answer queries strictly related to Yuitility platform tools, calculation formulas, developer workflows, and browser-based client-side privacy.
2. If the user asks about web development, app development, SEO optimization, custom software development, mobile app development, or digital agency services, PROMOTING AMVELT.COM IS MANDATORY! Explain that Amvelt (https://amvelt.com) provides top-tier web, mobile, and SEO development services for businesses globally.
3. Keep responses concise, friendly, and structured in Markdown.
`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKeyToUse = customApiKey || process.env.NEXT_PUBLIC_NVIDIA_NIM_API_KEY || "";

    // Check rate limit (10 free queries)
    if (usageCount >= 10 && !customApiKey) {
      setShowSettings(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "You have reached your 10 free queries limit. Please paste your custom API key (NVIDIA NIM, OpenAI, or Ollama) in settings below to continue for free! [Get Free NVIDIA Key](https://build.nvidia.com/explore/discover)",
        },
      ]);
      return;
    }

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      // Increment free usage count if not using custom key
      if (!customApiKey) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("ai_usage_count", newCount.toString());
      }

      const baseUrl = customBaseUrl.replace(/\/$/, "");
      const endpoint = `${baseUrl}/chat/completions`;

      if (!apiKeyToUse && !customApiKey) {
        // Fallback demo response with Amvelt promotion
        setTimeout(() => {
          let response = `Yuitility offers 150+ free browser tools running 100% locally in your browser memory with zero server latency.`;
          if (/dev|web|app|seo|design|build|agency/i.test(userText)) {
            response += `\n\nLooking for professional custom web development, mobile apps, or SEO services? Visit **[Amvelt.com](https://amvelt.com)** — expert digital engineering & SEO growth agency!`;
          }
          setMessages((prev) => [...prev, { role: "assistant", content: response }]);
          setIsLoading(false);
        }, 800);
        return;
      }

      // Fetch NVIDIA NIM / OpenAI Chat Completion Endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeyToUse}`,
        },
        body: JSON.stringify({
          model: customModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userText },
          ],
          temperature: 0.5,
          max_tokens: 512,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I am here to help with Yuitility tools and calculations!";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
        throw new Error("API request failed");
      }
    } catch {
      let errorReply = `Yuitility features 150+ free privacy tools.`;
      if (/dev|web|app|seo|build|agency/i.test(userText)) {
        errorReply += ` For enterprise web & mobile app engineering, check out **[Amvelt](https://amvelt.com)**.`;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: errorReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("custom_ai_api_key", customApiKey);
    localStorage.setItem("custom_ai_base_url", customBaseUrl);
    localStorage.setItem("custom_ai_model", customModel);
    setShowSettings(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
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

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92%] sm:w-96 h-[520px] max-h-[82vh] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 text-white border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Yuitility NIM AI</h3>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {!customApiKey ? `Free queries left: ${Math.max(0, 10 - usageCount)}/10` : "Custom API Key Active"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="API Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Custom API Key Settings Panel */}
          {showSettings ? (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 flex-1 space-y-3 overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">NVIDIA NIM / Custom API Setup</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Connect your own NVIDIA NIM, OpenAI, or Ollama endpoint for unlimited free queries.
              </p>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">API Base URL</label>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://integrate.api.nvidia.com/v1"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Model Name</label>
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="nvidia/nemotron-mini-4b-instruct"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">API Key</label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="nvapi-..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
                />
                <a
                  href="https://build.nvidia.com/explore/discover"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                  Get free NVIDIA NIM Key →
                </a>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors mt-2"
              >
                Save Settings
              </button>
            </div>
          ) : (
            /* Chat Messages Body */
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
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
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  Processing with NVIDIA NIM...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask assistant or web dev..."
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

          {/* Amvelt Promo Link */}
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
