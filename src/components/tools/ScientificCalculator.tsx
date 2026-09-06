"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Copy, History, Share2 } from "lucide-react";
import { recordToolUsage } from "@/src/components/ShareToast";

interface ScientificCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
  onTriggerShareToast?: () => void;
}

export default function ScientificCalculator({ onCopy, onShare, onTriggerShareToast }: ScientificCalculatorProps) {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [isRad, setIsRad] = useState<boolean>(true); // Radians vs Degrees mode
  const [is2nd, setIs2nd] = useState<boolean>(false); // 2nd function toggle
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ expr: string; result: string }>>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);

  const appendToExpression = useCallback((char: string) => {
    setDisplay((prev) => {
      if (prev === "0" || shouldResetDisplay) {
        setShouldResetDisplay(false);
        return char;
      }
      return prev + char;
    });
  }, [shouldResetDisplay]);

  const handleClearAll = () => {
    setDisplay("0");
    setExpression("");
    setShouldResetDisplay(false);
  };

  const handleClearEntry = () => {
    setDisplay("0");
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (shouldResetDisplay || prev.length <= 1) {
        setShouldResetDisplay(false);
        return "0";
      }
      return prev.slice(0, -1);
    });
  };

  // Evaluate Expression
  const handleEquals = () => {
    try {
      let evalExpr = display;

      // Replace mathematical constants and symbols
      evalExpr = evalExpr
        .replace(/π/g, `${Math.PI}`)
        .replace(/e/g, `${Math.E}`)
        .replace(/φ/g, `${(1 + Math.sqrt(5)) / 2}`)
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/(\d+)!/g, (_, n) => `${factorial(parseInt(n))}`);

      // Evaluate trigonometric functions considering DEG/RAD mode
      const toRad = (angle: number) => (isRad ? angle : (angle * Math.PI) / 180);
      const fromRad = (val: number) => (isRad ? val : (val * 180) / Math.PI);

      // Safe Math Context Scope
      const mathScope = {
        sin: (x: number) => Math.sin(toRad(x)),
        cos: (x: number) => Math.cos(toRad(x)),
        tan: (x: number) => Math.tan(toRad(x)),
        asin: (x: number) => fromRad(Math.asin(x)),
        acos: (x: number) => fromRad(Math.acos(x)),
        atan: (x: number) => fromRad(Math.atan(x)),
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
        cbrt: Math.cbrt,
        abs: Math.abs,
        pow: Math.pow,
        exp: Math.exp,
      };

      // Safely evaluate using Function constructor with scope keys
      const keys = Object.keys(mathScope);
      const values = Object.values(mathScope);

      // eslint-disable-next-line no-new-func
      const evaluator = new Function(...keys, `"use strict"; return (${evalExpr})`);
      const calcResult = evaluator(...values);

      const formatted = Number.isFinite(calcResult)
        ? String(Math.round(calcResult * 1e12) / 1e12)
        : "Error";

      setExpression(`${display} =`);
      setDisplay(formatted);
      setHistory((prev) => [{ expr: display, result: formatted }, ...prev.slice(0, 19)]);
      setShouldResetDisplay(true);

      // Trigger Usage Toast
      const shouldToast = recordToolUsage("scientific-calculator");
      if (shouldToast && onTriggerShareToast) {
        onTriggerShareToast();
      }
    } catch {
      setDisplay("Error");
      setShouldResetDisplay(true);
    }
  };

  // Helper Factorial
  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  // Single operand Scientific Functions
  const applyFunc = (fnName: string) => {
    setDisplay((prev) => {
      if (prev === "0" || shouldResetDisplay) {
        setShouldResetDisplay(false);
        return `${fnName}(`;
      }
      return `${fnName}(${prev})`;
    });
  };

  // Memory functions
  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setShouldResetDisplay(true);
  };
  const handleMemoryAdd = () => setMemory((prev) => prev + (parseFloat(display) || 0));
  const handleMemorySubtract = () => setMemory((prev) => prev - (parseFloat(display) || 0));
  const handleMemoryStore = () => setMemory(parseFloat(display) || 0);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") appendToExpression(e.key);
      else if (e.key === ".") appendToExpression(".");
      else if (e.key === "+") appendToExpression("+");
      else if (e.key === "-") appendToExpression("-");
      else if (e.key === "*") appendToExpression("×");
      else if (e.key === "/") {
        e.preventDefault();
        appendToExpression("÷");
      } else if (e.key === "(" || e.key === ")") appendToExpression(e.key);
      else if (e.key === "^") appendToExpression("**");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClearAll();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendToExpression, handleEquals]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Scientific Calculator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Complete scientific calculator with trig, logarithms, powers, roots, and memory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRad(!isRad)}
            className="px-3 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-md border border-blue-200 dark:border-blue-800"
          >
            {isRad ? "RAD" : "DEG"}
          </button>
          <button
            onClick={() => setIs2nd(!is2nd)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-colors ${
              is2nd
                ? "bg-amber-500 text-white border-amber-600"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
            }`}
          >
            2nd
          </button>
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
        {/* Main Scientific Keypad Workspace */}
        <div className="lg:col-span-8 space-y-4 max-w-xl mx-auto w-full">
          {/* Main Display */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-xl border border-zinc-800 flex flex-col justify-between min-h-[120px] font-mono">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="font-sans font-bold text-[10px] uppercase text-blue-400">
                {isRad ? "RAD" : "DEG"} {is2nd ? "| 2ND" : ""}
              </span>
              <span className="min-h-[18px] overflow-x-auto custom-scrollbar">{expression}</span>
            </div>
            <div className="text-right text-2xl sm:text-3xl font-bold tracking-tight text-white overflow-x-auto custom-scrollbar">
              {display}
            </div>
          </div>

          {/* Memory Controls */}
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

          {/* Scientific Functions Keypad Grid (5 Columns) */}
          <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
            {/* Scientific Functions Row 1 */}
            <button
              onClick={() => applyFunc(is2nd ? "asin" : "sin")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "sin⁻¹" : "sin"}
            </button>
            <button
              onClick={() => applyFunc(is2nd ? "acos" : "cos")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "cos⁻¹" : "cos"}
            </button>
            <button
              onClick={() => applyFunc(is2nd ? "atan" : "tan")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "tan⁻¹" : "tan"}
            </button>
            <button
              onClick={() => appendToExpression("(")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              (
            </button>
            <button
              onClick={() => appendToExpression(")")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              )
            </button>

            {/* Scientific Functions Row 2 */}
            <button
              onClick={() => applyFunc(is2nd ? "sinh" : "log")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "sinh" : "log"}
            </button>
            <button
              onClick={() => applyFunc(is2nd ? "cosh" : "ln")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "cosh" : "ln"}
            </button>
            <button
              onClick={() => appendToExpression(is2nd ? "10**" : "**")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "10ˣ" : "xʸ"}
            </button>
            <button
              onClick={() => applyFunc(is2nd ? "cbrt" : "sqrt")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              {is2nd ? "∛x" : "√x"}
            </button>
            <button
              onClick={handleClearEntry}
              className="p-3 bg-zinc-200 dark:bg-zinc-800 text-red-600 dark:text-red-400 rounded-xl transition-colors"
            >
              CE
            </button>

            {/* Scientific Functions Row 3 */}
            <button
              onClick={() => appendToExpression("π")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors font-serif"
            >
              π
            </button>
            <button
              onClick={() => appendToExpression("e")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors font-serif"
            >
              e
            </button>
            <button
              onClick={() => appendToExpression("!")}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              n!
            </button>
            <button
              onClick={handleBackspace}
              className="p-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              ⌫
            </button>
            <button
              onClick={handleClearAll}
              className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl transition-colors font-bold"
            >
              C
            </button>

            {/* Row 4 - Number Pad */}
            <button
              onClick={() => appendToExpression("7")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              7
            </button>
            <button
              onClick={() => appendToExpression("8")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              8
            </button>
            <button
              onClick={() => appendToExpression("9")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              9
            </button>
            <button
              onClick={() => appendToExpression("%")}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              %
            </button>
            <button
              onClick={() => appendToExpression("÷")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-lg"
            >
              ÷
            </button>

            {/* Row 5 */}
            <button
              onClick={() => appendToExpression("4")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              4
            </button>
            <button
              onClick={() => appendToExpression("5")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              5
            </button>
            <button
              onClick={() => appendToExpression("6")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              6
            </button>
            <button
              onClick={() => applyFunc("abs")}
              className="p-3.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition-colors"
            >
              |x|
            </button>
            <button
              onClick={() => appendToExpression("×")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-lg"
            >
              ×
            </button>

            {/* Row 6 */}
            <button
              onClick={() => appendToExpression("1")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              1
            </button>
            <button
              onClick={() => appendToExpression("2")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              2
            </button>
            <button
              onClick={() => appendToExpression("3")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              3
            </button>
            <button
              onClick={() => appendToExpression("-")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-lg"
            >
              -
            </button>
            <button
              onClick={() => appendToExpression("+")}
              className="p-3.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors text-lg"
            >
              +
            </button>

            {/* Row 7 */}
            <button
              onClick={() => appendToExpression("0")}
              className="col-span-2 p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              0
            </button>
            <button
              onClick={() => appendToExpression(".")}
              className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl transition-colors text-base shadow-sm"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="col-span-2 p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-xl font-bold shadow-lg shadow-blue-500/20"
            >
              =
            </button>
          </div>

          {/* Bottom Share Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onShare("Scientific Calculator", "scientific-calculator")}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Copy Share Link
            </button>
          </div>
        </div>

        {/* History Drawer */}
        {showHistory && (
          <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col h-[480px]">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Scientific History
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
                <p className="text-xs text-zinc-400 text-center py-10">No scientific calculation history</p>
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
