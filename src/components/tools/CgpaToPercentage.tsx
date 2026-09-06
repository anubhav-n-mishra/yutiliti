import React, { useState } from 'react';
import { Award, Copy, Check, GraduationCap, School, CheckCircle2, ChevronRight } from 'lucide-react';

interface CgpaToPercentageProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export type UniversityFormula =
  | 'cbse'
  | 'vtu'
  | 'anna'
  | 'mumbai'
  | 'ktu'
  | 'gtu'
  | 'sppu'
  | 'aktu'
  | 'linear10'
  | 'linear4'
  | 'custom';

interface UniversityConfig {
  id: UniversityFormula;
  name: string;
  subtitle: string;
  formulaLabel: string;
  calculate: (cgpa: number, customMult: number) => { percent: number; formulaDisplay: string };
  circularRef: string;
}

const UNIVERSITIES: UniversityConfig[] = [
  {
    id: 'cbse',
    name: 'CBSE / DU / AICTE',
    subtitle: 'Delhi Univ, CBSE Class 10 & 12, AICTE Standard',
    formulaLabel: 'CGPA × 9.5',
    calculate: (c) => ({ percent: c * 9.5, formulaDisplay: `${c} × 9.5 = ${(c * 9.5).toFixed(2)}%` }),
    circularRef: 'CBSE Exam Bylaws Rule 42.1 / AICTE Model Curricula',
  },
  {
    id: 'vtu',
    name: 'VTU (Visvesvaraya)',
    subtitle: 'Visvesvaraya Technological University (Karnataka)',
    formulaLabel: '[CGPA − 0.75] × 10',
    calculate: (c) => ({
      percent: Math.max(0, (c - 0.75) * 10),
      formulaDisplay: `(${c} − 0.75) × 10 = ${Math.max(0, (c - 0.75) * 10).toFixed(2)}%`,
    }),
    circularRef: 'VTU/BGM/Aca-OS/Cirs/2016-17/10006',
  },
  {
    id: 'anna',
    name: 'Anna University',
    subtitle: 'Anna University Chennai & Affiliated Colleges',
    formulaLabel: 'CGPA × 10',
    calculate: (c) => ({ percent: c * 10, formulaDisplay: `${c} × 10 = ${(c * 10).toFixed(2)}%` }),
    circularRef: 'Anna University Regulation 2021 Clause 16.2',
  },
  {
    id: 'mumbai',
    name: 'Mumbai University (MU)',
    subtitle: 'University of Mumbai (Engineering Scale)',
    formulaLabel: '7.1 × CGPA + 12',
    calculate: (c) => ({
      percent: 7.1 * c + 12,
      formulaDisplay: `7.1 × ${c} + 12 = ${(7.1 * c + 12).toFixed(2)}%`,
    }),
    circularRef: 'Univ of Mumbai Examination Section Circular VCD/No. 15',
  },
  {
    id: 'ktu',
    name: 'KTU (Kerala Tech)',
    subtitle: 'APJ Abdul Kalam Technological University',
    formulaLabel: '[CGPA − 0.5] × 10',
    calculate: (c) => ({
      percent: Math.max(0, (c - 0.5) * 10),
      formulaDisplay: `(${c} − 0.5) × 10 = ${Math.max(0, (c - 0.5) * 10).toFixed(2)}%`,
    }),
    circularRef: 'KTU Academic Regulations B.Tech Clause 12.2',
  },
  {
    id: 'gtu',
    name: 'GTU (Gujarat Tech)',
    subtitle: 'Gujarat Technological University',
    formulaLabel: '[CGPA − 0.5] × 10',
    calculate: (c) => ({
      percent: Math.max(0, (c - 0.5) * 10),
      formulaDisplay: `(${c} − 0.5) × 10 = ${Math.max(0, (c - 0.5) * 10).toFixed(2)}%`,
    }),
    circularRef: 'GTU Circular Ref No. GTU/Academic/2011/5305',
  },
  {
    id: 'sppu',
    name: 'SPPU (Pune University)',
    subtitle: 'Savitribai Phule Pune University',
    formulaLabel: '[CGPA − 0.75] × 10',
    calculate: (c) => ({
      percent: Math.max(0, (c - 0.75) * 10),
      formulaDisplay: `(${c} − 0.75) × 10 = ${Math.max(0, (c - 0.75) * 10).toFixed(2)}%`,
    }),
    circularRef: 'SPPU Ordinance Examination Grading Table Rules',
  },
  {
    id: 'aktu',
    name: 'AKTU / UPTU',
    subtitle: 'Dr. A.P.J. Abdul Kalam Technical University (UP)',
    formulaLabel: 'CGPA × 10',
    calculate: (c) => ({ percent: c * 10, formulaDisplay: `${c} × 10 = ${(c * 10).toFixed(2)}%` }),
    circularRef: 'AKTU B.Tech Ordinance Section 11 Evaluation',
  },
  {
    id: 'linear10',
    name: 'Standard Linear 10',
    subtitle: 'Direct percentage proportion (out of 10.0)',
    formulaLabel: '(CGPA ÷ 10) × 100',
    calculate: (c) => ({ percent: (c / 10) * 100, formulaDisplay: `(${c} ÷ 10) × 100 = ${((c / 10) * 100).toFixed(2)}%` }),
    circularRef: 'Direct Mathematical Ratio',
  },
  {
    id: 'custom',
    name: 'Custom Multiplier',
    subtitle: 'Specify a custom institution conversion multiplier',
    formulaLabel: 'CGPA × Multiplier',
    calculate: (c, m) => ({ percent: c * m, formulaDisplay: `${c} × ${m} = ${(c * m).toFixed(2)}%` }),
    circularRef: 'User Defined Institution Formula',
  },
];

export default function CgpaToPercentage({ onCopy }: CgpaToPercentageProps) {
  const [cgpa, setCgpa] = useState<string>('8.4');
  const [formula, setFormula] = useState<UniversityFormula>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<string>('9.5');
  const [copied, setCopied] = useState<boolean>(false);

  const numCgpa = parseFloat(cgpa);
  const selectedConfig = UNIVERSITIES.find((u) => u.id === formula) || UNIVERSITIES[0];

  let percentage: number | null = null;
  let formulaDisplay = '';

  if (!isNaN(numCgpa) && numCgpa >= 0 && numCgpa <= 10) {
    const customMult = parseFloat(customMultiplier) || 9.5;
    const res = selectedConfig.calculate(numCgpa, customMult);
    percentage = Math.min(100, Math.max(0, res.percent));
    formulaDisplay = res.formulaDisplay;
  }

  // Academic division classification
  let division = '';
  let badgeColor = '';
  if (percentage !== null) {
    if (percentage >= 75) {
      division = 'First Class with Distinction (Honours)';
      badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    } else if (percentage >= 60) {
      division = 'First Division / First Class';
      badgeColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40';
    } else if (percentage >= 50) {
      division = 'Second Division / Second Class';
      badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    } else if (percentage >= 40) {
      division = 'Pass Class (Third Division)';
      badgeColor = 'text-orange-400 border-orange-500/30 bg-orange-950/40';
    } else {
      division = 'Fail / Reappear Required';
      badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40';
    }
  }

  const handleCopy = () => {
    if (percentage === null) return;
    const text = `${percentage.toFixed(2)}% (CGPA: ${cgpa}, Formula: ${selectedConfig.name} [${selectedConfig.formulaLabel}], Division: ${division})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-8">
      {/* Primary Input & Output Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="cgpa-input" className="text-sm font-semibold text-slate-200">
                Enter Your CGPA (Cumulative Grade Point Average)
              </label>
              <span className="text-xs text-slate-400 font-mono">Scale 0.0 – 10.0</span>
            </div>
            <div className="relative">
              <input
                id="cgpa-input"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.40"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-3xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <span className="absolute right-4 top-4 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                / 10.0 Max
              </span>
            </div>
          </div>

          {/* University Formula Selector Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <School className="w-4 h-4 text-indigo-400" /> Select University or Board Formula
              </label>
              <span className="text-xs text-indigo-400 font-medium">10 Official Rules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {UNIVERSITIES.map((univ) => (
                <button
                  key={univ.id}
                  type="button"
                  onClick={() => setFormula(univ.id)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    formula === univ.id
                      ? 'border-indigo-500 bg-indigo-950/60 text-white ring-1 ring-indigo-500/50'
                      : 'border-slate-800/90 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-slate-100">{univ.name}</div>
                    <span className="font-mono text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/60">
                      {univ.formulaLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{univ.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {formula === 'custom' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Custom Multiplier Factor</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm w-36 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400">Formula: CGPA × {customMultiplier}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Card */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Equivalent Percentage</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="text-5xl sm:text-6xl font-black font-mono text-indigo-400 tracking-tight my-2">
              {percentage !== null ? `${percentage.toFixed(2)}%` : '—'}
            </div>

            {formulaDisplay && (
              <div className="text-xs text-slate-300 font-mono bg-slate-950/90 p-3 rounded-xl border border-slate-800 my-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Applied Formula</div>
                <div className="text-indigo-300 font-semibold">{formulaDisplay}</div>
              </div>
            )}

            {division && (
              <div className="mt-2 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">Academic Classification:</div>
                <div className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${badgeColor}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {division}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Official Standard: </span>
              {selectedConfig.circularRef}
            </div>
          </div>

          <button
            type="button"
            disabled={percentage === null}
            onClick={handleCopy}
            className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Calculation to Clipboard' : 'Copy Equivalent Percentage'}
          </button>
        </div>
      </div>

      {/* Official University Formulas Reference Table (High Information Gain) */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" /> Official Indian Universities &amp; Boards Conversion Rules
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified circular regulations across top statutory educational authorities in India.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Board / University</th>
                <th className="py-3 px-4">Scale</th>
                <th className="py-3 px-4">Official Formula</th>
                <th className="py-3 px-4">Circular / Rule Reference</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Quick Apply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {UNIVERSITIES.filter((u) => u.id !== 'custom').map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">10.0</td>
                  <td className="py-3 px-4 font-mono text-indigo-300 font-bold">{u.formulaLabel}</td>
                  <td className="py-3 px-4 text-slate-400">{u.circularRef}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setFormula(u.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/40 hover:border-indigo-600 transition"
                    >
                      Use <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

