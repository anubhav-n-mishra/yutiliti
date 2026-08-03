"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ExternalLink, Loader2, Settings, ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";
import { TOOLS } from "@/src/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TOOL_COUNT = TOOLS.length;

// Build a compact tool directory string for the AI system prompt
const TOOL_DIRECTORY = TOOLS.slice(0, 60)
  .map((t) => `${t.title} -> /tools/${t.id}`)
  .join("\n");

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am YUI, your Yuitility AI Assistant. Ask me anything about our ${TOOL_COUNT} free browser tools, calculations, or custom web/app development services!`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const SYSTEM_PROMPT = `You are YUI, the official AI Assistant for Yuitility (yuitility.app).
Yuitility is a 100% private, free online browser-based toolkit with exactly ${TOOL_COUNT} tools.

TOOL DIRECTORY (use these exact links when recommending tools):
${TOOL_DIRECTORY}

RULES:
1. Introduce yourself as YUI.
2. When a user asks for a tool, ALWAYS provide the direct markdown link from the directory above. Format: [Open Tool Name](/tools/tool-id)
3. FORMATTING IS CRITICAL:
   - Every numbered step MUST be on its own separate line.
   - Use **bold** for key terms.
   - Use *italics* for helpful notes.
   - NEVER combine multiple steps into one paragraph.
   - Example response format:

Here is the tool link:
[Open Age Calculator](/tools/age-calculator)

How to use it:
1. **Click the link** above to open the tool page.
2. **Enter your date of birth** in the input field.
3. **Click Calculate** to see your exact age.

*All processing happens 100% in your browser with zero server uploads.*

4. If the user asks about web development, app development, SEO, or digital agency services, recommend [Visit Amvelt.com](https://amvelt.com).
5. Keep responses concise and well-structured.`;

  const handleSendText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (usageCount >= 10 && !customApiKey) {
      setShowSettings(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `You have used your 10 free responses. Please enter your custom API key in settings to continue unlimited queries with YUI.\n\n[Get Free API Key](https://build.nvidia.com/explore/discover)`,
        },
      ]);
      return;
    }

    const userText = text.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      if (!customApiKey) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("ai_usage_count", newCount.toString());
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          ],
          model: customModel,
          baseUrl: customBaseUrl,
          customApiKey: customApiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error("Server response error");
      }
    } catch {
      // Offline fallback: try to match a tool from user text
      const lowerText = userText.toLowerCase();
      const matchedTool = TOOLS.find(
        (t) =>
          lowerText.includes(t.title.toLowerCase()) ||
          lowerText.includes(t.id.replace(/-/g, " "))
      );
      let fallback = "";
      if (matchedTool) {
        fallback = `Here is the tool you requested:\n\n[Open ${matchedTool.title}](/tools/${matchedTool.id})\n\nHow to use it:\n1. **Click the button** above to open the tool.\n2. **Enter your data** into the input fields.\n3. **View your results** instantly in your browser.\n\n*All processing happens 100% locally with zero server uploads.*`;
      } else if (/dev|web|app|seo|build|agency/i.test(userText)) {
        fallback = `For custom web and mobile software development, check out:\n\n[Visit Amvelt.com](https://amvelt.com)\n\nAmvelt provides enterprise-grade web, mobile, and SEO engineering services.`;
      } else {
        fallback = `Yuitility provides ${TOOL_COUNT} free browser tools for PDF, finance, image processing, and developer workflows.\n\nHow can I help you find the right tool?`;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(input);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("custom_ai_api_key", customApiKey);
    localStorage.setItem("custom_ai_base_url", customBaseUrl);
    localStorage.setItem("custom_ai_model", customModel);
    setShowSettings(false);
  };

  // --- Rich Markdown Renderer ---

  const renderInlineMarkdown = (text: string, keyPrefix: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    // Combined regex: markdown links, bold, italic, underline
    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|<u>([^<]+)<\/u>)/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Push plain text before this match
      if (match.index > lastIdx) {
        result.push(<span key={`${keyPrefix}-t${lastIdx}`}>{text.substring(lastIdx, match.index)}</span>);
      }

      if (match[2] && match[3]) {
        // Markdown link [text](url)
        const linkText = match[2];
        const linkUrl = match[3];
        const isInternal = linkUrl.startsWith("/");
        result.push(
          <span key={`${keyPrefix}-link${match.index}`} className="inline-block my-1.5">
            <Link
              href={linkUrl}
              target={isInternal ? "_self" : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-[11px] rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
            >
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span>{linkText}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </span>
        );
      } else if (match[4]) {
        // Bold **text**
        result.push(<strong key={`${keyPrefix}-b${match.index}`} className="font-bold text-zinc-950 dark:text-white">{match[4]}</strong>);
      } else if (match[5]) {
        // Italic *text*
        result.push(<em key={`${keyPrefix}-i${match.index}`} className="italic text-zinc-700 dark:text-zinc-300">{match[5]}</em>);
      } else if (match[6]) {
        // Italic _text_
        result.push(<em key={`${keyPrefix}-i2${match.index}`} className="italic text-zinc-700 dark:text-zinc-300">{match[6]}</em>);
      } else if (match[7]) {
        // Underline <u>text</u>
        result.push(<u key={`${keyPrefix}-u${match.index}`} className="underline decoration-blue-500 underline-offset-2">{match[7]}</u>);
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
      result.push(<span key={`${keyPrefix}-tail`}>{text.substring(lastIdx)}</span>);
    }

    return result;
  };

  const renderMessageContent = (content: string) => {
    // Normalize: break squished numbered steps onto new lines
    let normalized = content
      .replace(/([.!?])\s+(\d+)\.\s/g, "$1\n$2. ")
      .replace(/:\s+(\d+)\.\s/g, ":\n$1. ");

    const lines = normalized.split("\n");

    return (
      <div className="space-y-1.5">
        {lines.map((rawLine, idx) => {
          const line = rawLine.trim();
          if (!line) return null;

          // Numbered step: "1. Something"
          const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 py-1 border-l-2 border-blue-500/70 pl-2.5">
                <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {numMatch[1]}
                </span>
                <span className="text-xs leading-relaxed flex-1">
                  {renderInlineMarkdown(numMatch[2], `n${idx}`)}
                </span>
              </div>
            );
          }

          // Bullet: "- Something" or "* Something"
          const bulletMatch = line.match(/^[-*]\s+(.*)$/);
          if (bulletMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-[7px]" />
                <span className="text-xs leading-relaxed flex-1">
                  {renderInlineMarkdown(bulletMatch[1], `b${idx}`)}
                </span>
              </div>
            );
          }

          // Regular paragraph
          return (
            <div key={idx} className="text-xs leading-relaxed">
              {renderInlineMarkdown(line, `p${idx}`)}
            </div>
          );
        })}
      </div>
    );
  };

  const starterQuestions = [
    { icon: "calc", label: "Age Calculator", query: "Can you give me the link and step-by-step guide for the Age Calculator tool?" },
    { icon: "money", label: "EMI Loan Calculator", query: "Where is the EMI Calculator tool and how do I calculate loan payments?" },
    { icon: "pdf", label: "PDF Merge Tool", query: "How do I merge multiple PDF files in my browser?" },
    { icon: "code", label: "Custom Web Dev", query: "I need custom web development or mobile app engineering." },
  ];

  const starterIcons: Record<string, React.ReactNode> = {
    calc: <Bot className="w-3.5 h-3.5 text-blue-500" />,
    money: <Bot className="w-3.5 h-3.5 text-emerald-500" />,
    pdf: <Bot className="w-3.5 h-3.5 text-red-500" />,
    code: <Bot className="w-3.5 h-3.5 text-cyan-500" />,
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
        aria-label="Open YUI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
          YUI Assistant
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92%] sm:w-96 h-[540px] max-h-[85vh] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden font-sans animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 text-white border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">YUI Assistant</h3>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  {!customApiKey ? `Free responses left: ${Math.max(0, 10 - usageCount)}/10` : "Custom Key Active"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="API Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 flex-1 space-y-3 overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">YUI Assistant API Settings</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Connect your custom API key or LLM model endpoint for unlimited free queries with YUI.
              </p>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">API Base URL</label>
                <input type="text" value={customBaseUrl} onChange={(e) => setCustomBaseUrl(e.target.value)} placeholder="https://integrate.api.nvidia.com/v1" className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Model Name</label>
                <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="nvidia/nemotron-mini-4b-instruct" className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">API Key</label>
                <input type="password" value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} placeholder="Paste API Key here..." className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none" />
                <a href="https://build.nvidia.com/explore/discover" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1">Get free API Key</a>
              </div>
              <button onClick={handleSaveSettings} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors mt-2">Save Settings</button>
            </div>
          ) : (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 dark:bg-zinc-950/50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[88%] ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none text-xs" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm"}`}>
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              ))}

              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">Quick Questions:</p>
                  <div className="flex flex-col gap-1.5">
                    {starterQuestions.map((sq, i) => (
                      <button key={i} onClick={() => handleSendText(sq.query)} className="text-left px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm flex items-center gap-2.5">
                        {starterIcons[sq.icon]}
                        <span className="flex-1">{sq.label}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-zinc-500 font-medium pt-1">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  YUI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shrink-0">
            <input type="text" placeholder="Ask YUI anything..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-3 py-2 text-xs bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100" />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>

          <a href="https://amvelt.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-500 hover:text-blue-600 flex items-center justify-between transition-colors shrink-0">
            <span>Need Custom Web/App Dev? <strong>Amvelt.com</strong></span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </>
  );
}
