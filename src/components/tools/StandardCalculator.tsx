"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Copy, History, Share2 } from "lucide-react";
import { recordToolUsage } from "@/src/components/ShareToast";

interface StandardCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
  onTriggerShareToast?: () => void;
}

export default function StandardCalculator({ onCopy, onShare, onTriggerShareToast }: StandardCalculatorProps) {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ expr: string; result: string }>>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);

  const handleDigit = useCallback((digit: string) => {
    setDisplay((prev) => {
      if (prev === "0" || shouldResetDisplay) {
        setShouldResetDisplay(false);
        return digit;
      }
      if (prev.length >= 16) return prev;
      return prev + digit;
    });
  }, [shouldResetDisplay]);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => {
      if (shouldResetDisplay) {
        setShouldResetDisplay(false);
        return "0.";
      }
      if (!prev.includes(".")) {
        return prev + ".";
      }
      return prev;
    });
  }, [shouldResetDisplay]);

  const handleClearAll = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setShouldResetDisplay(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay("0");
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => {
      if (shouldResetDisplay || prev.length <= 1) {
        setShouldResetDisplay(false);
        return "0";
      }
      return prev.slice(0, -1);
    });
  }, [shouldResetDisplay]);

  const handleOperator = useCallback((op: string) => {
    setExpression((prev) => {
      if (shouldResetDisplay && prev.endsWith("=")) {
        return `${display} ${op} `;
      }
      return `${expression}${display} ${op} `;
    });
    setShouldResetDisplay(true);
  }, [display, expression, shouldResetDisplay]);

  const handleEquals = useCallback(() => {
    if (!expression && !shouldResetDisplay) return;
    
    const fullExpr = expression + display;
    try {
      // Safe mathematical evaluation
      const sanitized = fullExpr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/--/g, "+");
      
      // eslint-disable-next-line no-eval
      const calcResult = Function(`"use strict"; return (${sanitized})`)();
      const formatted = Number.isFinite(calcResult)
        ? String(Math.round(calcResult * 1e10) / 1e10)
        : "Error";

      setDisplay(formatted);
      setExpression(`${fullExpr} =`);
      setHistory((prev) => [{ expr: fullExpr, result: formatted }, ...prev.slice(0, 19)]);
      setShouldResetDisplay(true);

      // Record tool usage
      const shouldToast = recordToolUsage("standard-calculator");
      if (shouldToast && onTriggerShareToast) {
        onTriggerShareToast();
      }
    } catch {
      setDisplay("Error");
      setShouldResetDisplay(true);
    }
  }, [display, expression, shouldResetDisplay, onTriggerShareToast]);

  const handleNegate = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "0") return "0";
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay((prev) => {
      const val = parseFloat(prev);
      if (isNaN(val)) return "0";
      return String(val / 100);
    });
  }, []);

  const handleSquareRoot = useCallback(() => {
    setDisplay((prev) => {
      const val = parseFloat(prev);
      if (isNaN(val) || val < 0) return "Error";
      return String(Math.sqrt(val));
    });
  }, []);

  const handleSquare = useCallback(() => {
    setDisplay((prev) => {
      const val = parseFloat(prev);
      if (isNaN(val)) return "0";
      return String(val * val);
    });
  }, []);

  const handleReciprocal = useCallback(() => {
    setDisplay((prev) => {
      const val = parseFloat(prev);
      if (isNaN(val) || val === 0) return "Error";
      return String(1 / val);
    });
  }, []);

  // Memory functions
  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setShouldResetDisplay(true);
  };
  const handleMemoryAdd = () => setMemory((prev) => prev + (parseFloat(display) || 0));
  const handleMemorySubtract = () => setMemory((prev) => prev - (parseFloat(display) || 0));
  const handleMemoryStore = () => setMemory(parseFloat(display) || 0);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === ".") handleDecimal();
      else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("-");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClearAll();
      else if (e.key === "%") handlePercent();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClearAll, handlePercent]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Standard Calculator
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Fast, clean, high-precision basic calculator with memory and history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              showHistory
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Calculator */}
        <div className="lg:col-span-8 space-y-4 max-w-md mx-auto w-full">
          {/* Display screen */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-xl border border-zinc-800 flex flex-col justify-between min-h-[120px] font-mono">
            <div className="text-right text-xs text-zinc-400 min-h-[20px] overflow-x-auto custom-scrollbar">
              {expression}
            </div>
            <div className="text-right text-3xl sm:text-4xl font-bold tracking-tight text-white overflow-x-auto custom-scrollbar">
              {display}
            </div>
          </div>

          {/* Memory Row */}
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={handleMemoryClear}
              className="py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              MC
            </button>
            <button
              onClick={handleMemoryRecall}
              className="py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              MR
            </button>
            <button
              onClick={handleMemoryAdd}
              className="py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              M+
            </button>
            <button
              onClick={handleMemorySubtract}
              className="py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              M-
            </button>
            <button
              onClick={handleMemoryStore}
              className="py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              MS
            </button>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2 text-base font-semibold">
            {/* Row 1 */}
            <button
              onClick={handlePercent}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              %
            </button>
            <button
              onClick={handleClearEntry}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              CE
            </button>
            <button
              onClick={handleClearAll}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              ⌫
            </button>

            {/* Row 2 */}
            <button
              onClick={handleReciprocal}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              1/x
            </button>
            <button
              onClick={handleSquare}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              x²
            </button>
            <button
              onClick={handleSquareRoot}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              √x
            </button>
            <button
              onClick={() => handleOperator("÷")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-xl"
            >
              ÷
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleDigit("7")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              7
            </button>
            <button
              onClick={() => handleDigit("8")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              8
            </button>
            <button
              onClick={() => handleDigit("9")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              9
            </button>
            <button
              onClick={() => handleOperator("×")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-xl"
            >
              ×
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleDigit("4")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              4
            </button>
            <button
              onClick={() => handleDigit("5")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              5
            </button>
            <button
              onClick={() => handleDigit("6")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              6
            </button>
            <button
              onClick={() => handleOperator("-")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-xl"
            >
              -
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleDigit("1")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              1
            </button>
            <button
              onClick={() => handleDigit("2")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              2
            </button>
            <button
              onClick={() => handleDigit("3")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              3
            </button>
            <button
              onClick={() => handleOperator("+")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-xl"
            >
              +
            </button>

            {/* Row 6 */}
            <button
              onClick={handleNegate}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit("0")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors shadow-sm"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-xl shadow-lg shadow-blue-500/20"
            >
              =
            </button>
          </div>

          {/* Bottom Share Link Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onShare("Standard Calculator", "/tools/standard-calculator")}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Copy Share Link
            </button>
          </div>
        </div>

        {/* History Drawer */}
        {showHistory && (
          <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Calculation History
              </h3>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-10">No recent calculations</p>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setDisplay(item.result);
                      setShouldResetDisplay(true);
                    }}
                    className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-blue-400 transition-colors font-mono text-right"
                  >
                    <p className="text-[11px] text-zinc-400">{item.expr}</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.result}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
