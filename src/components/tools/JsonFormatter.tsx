import React, { useState, useMemo } from 'react';
import { RefreshCw, Share2, Copy, Trash2, CheckCircle2, AlertTriangle, Code, ChevronRight, ChevronDown } from 'lucide-react';

interface JsonFormatterProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

// Subcomponent to render recursive JSON Tree nodes
interface TreeNodeProps {
  key?: string | number;
  name: string | number;
  val: any;
  isLast: boolean;
}

function JsonTreeNode({ name, val, isLast }: TreeNodeProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  const isObject = val !== null && typeof val === 'object';
  const isArray = Array.isArray(val);

  if (!isObject) {
    let renderedVal = '';
    let valClass = 'text-zinc-900 dark:text-zinc-100';

    if (typeof val === 'string') {
      renderedVal = `"${val}"`;
      valClass = 'text-emerald-600 dark:text-emerald-400 font-medium';
    } else if (typeof val === 'number') {
      renderedVal = String(val);
      valClass = 'text-blue-600 dark:text-blue-400 font-semibold';
    } else if (typeof val === 'boolean') {
      renderedVal = String(val);
      valClass = 'text-amber-600 dark:text-amber-500 font-bold';
    } else if (val === null) {
      renderedVal = 'null';
      valClass = 'text-zinc-400 font-italic';
    }

    return (
      <div className="pl-4 font-mono text-xs py-0.5">
        <span className="text-purple-600 dark:text-purple-400">"{name}"</span>
        <span className="text-zinc-400 dark:text-zinc-600 mx-1">:</span>
        <span className={valClass}>{renderedVal}</span>
        {!isLast && <span className="text-zinc-400 dark:text-zinc-600">,</span>}
      </div>
    );
  }

  const keys = Object.keys(val);
  const brackets = isArray ? ['[', ']'] : ['{', '}'];

  return (
    <div className="pl-4 font-mono text-xs py-0.5">
      <div className="flex items-center cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400 mr-1" />}
        <span className="text-purple-600 dark:text-purple-400">"{name}"</span>
        <span className="text-zinc-400 dark:text-zinc-600 mx-1">:</span>
        <span className="text-zinc-400 dark:text-zinc-500 font-semibold">{brackets[0]}</span>
        {!expanded && (
          <span className="text-zinc-400 text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1 py-0.2 rounded mx-1">
            {keys.length} items
          </span>
        )}
        {!expanded && <span className="text-zinc-400 dark:text-zinc-500">{brackets[1]}</span>}
        {!expanded && !isLast && <span className="text-zinc-400 dark:text-zinc-500">,</span>}
      </div>

      {expanded && (
        <div className="border-l border-zinc-200 dark:border-zinc-800 ml-1.5 pl-1 my-0.5 space-y-0.5">
          {keys.map((key, index) => (
            <JsonTreeNode
              key={key}
              name={key}
              val={val[key]}
              isLast={index === keys.length - 1}
            />
          ))}
        </div>
      )}

      {expanded && (
        <div className="pl-4 text-zinc-400 dark:text-zinc-500">
          {brackets[1]}
          {!isLast && <span>,</span>}
        </div>
      )}
    </div>
  );
}

export default function JsonFormatter({ onCopy, onShare }: JsonFormatterProps) {
  const [inputJson, setInputJson] = useState<string>(
     `{\n  "app": "Yuitility",\n  "version": 1.2,\n  "premium": true,\n  "tools_list": [\n    "EMI Calculator",\n    "SIP Calculator",\n    "Password Generator",\n    "QR Generator"\n  ],\n  "author": {\n    "name": "Yuitility Team",\n    "email": "hello@yuitility.app"\n  }\n}`
  );
  const [parsedObj, setParsedObj] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [indentSpace, setIndentSpace] = useState<number>(2);

  const handlePrettify = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setParsedObj(null);
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, indentSpace));
      setParsedObj(parsed);
      setSuccessMsg('JSON parsed & formatted successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax structure.');
    }
  };

  const handleMinify = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setParsedObj(null);
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setParsedObj(parsed);
      setSuccessMsg('JSON minified successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax structure.');
    }
  };

  const handleValidate = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setParsedObj(null);
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      setParsedObj(parsed);
      setSuccessMsg('Perfect! Valid JSON structure detected.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax structure.');
    }
  };

  const handleCopy = () => {
    onCopy(inputJson);
  };

  const handleLoadSample = () => {
    setInputJson(`{\n  "product": "Yuitility Bundle",\n  "active": true,\n  "stats": {\n    "total_tools": 10,\n    "framework": "React 19"\n  }\n}`);
    setErrorMsg(null);
    setSuccessMsg(null);
    setParsedObj(null);
  };

  const handleReset = () => {
    setInputJson('');
    setParsedObj(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">JSON Formatter & Validator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Prettify, minify, validate syntax, and inspect JSON variables visually.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy Output
          </button>
          <button
            onClick={() => onShare("JSON Formatter", "#/json-formatter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Raw JSON payload</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Indent:</span>
              <select
                value={indentSpace}
                onChange={(e) => setIndentSpace(parseInt(e.target.value))}
                className="text-xs bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded px-2 py-0.5 outline-none"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>
          </div>

          <textarea
            rows={15}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste raw/unformatted JSON here..."
            className="w-full p-4 text-xs font-mono bg-zinc-900 text-zinc-100 rounded-xl border border-zinc-800 outline-none focus:border-zinc-700 leading-relaxed shadow-inner"
          />

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handlePrettify}
              className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Prettify Format
            </button>
            <button
              onClick={handleMinify}
              className="px-4 py-2 bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-700 transition-colors"
            >
              Minify JSON
            </button>
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              Validate syntax
            </button>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Validation Status</h2>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Syntax Error</p>
                    <p className="font-mono mt-1 text-[10px] leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">JSON OK</p>
                    <p className="mt-0.5">{successMsg}</p>
                  </div>
                </div>
              )}

              {!errorMsg && !successMsg && (
                <div className="text-center py-6 text-zinc-400">
                  <Code className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                  <p className="text-xs font-medium">Validation, formatting logs, and schemas will compile here.</p>
                </div>
              )}
            </div>

            {/* Tree Inspector Node Block (Displays only on successful parse) */}
            {parsedObj && (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl p-4 mt-4 overflow-y-auto max-h-[250px]">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-3 tracking-wider">Interactive Node Tree</p>
                <div className="space-y-1">
                  <JsonTreeNode name="Root" val={parsedObj} isLast={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
