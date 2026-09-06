import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check, Award, Calculator, Target } from 'lucide-react';

interface CgpaCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

interface Semester {
  id: string;
  name: string;
  sgpa: string;
  credits: string;
}

export default function CgpaCalculator({ onCopy }: CgpaCalculatorProps) {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', sgpa: '8.2', credits: '20' },
    { id: '2', name: 'Semester 2', sgpa: '8.6', credits: '22' },
    { id: '3', name: 'Semester 3', sgpa: '8.8', credits: '24' },
    { id: '4', name: 'Semester 4', sgpa: '9.0', credits: '22' },
  ]);

  const [targetCgpa, setTargetCgpa] = useState<string>('9.0');
  const [remainingCredits, setRemainingCredits] = useState<string>('44');
  const [copied, setCopied] = useState<boolean>(false);

  const addSemester = () => {
    const nextNum = semesters.length + 1;
    setSemesters((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Semester ${nextNum}`, sgpa: '', credits: '20' },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSemester = (id: string, field: 'sgpa' | 'credits', val: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // Cumulative calculation
  let totalCredits = 0;
  let totalGradePoints = 0;
  let validSemestersCount = 0;

  for (const s of semesters) {
    const sgpaVal = parseFloat(s.sgpa);
    const crVal = parseFloat(s.credits) || 0;
    if (!isNaN(sgpaVal) && sgpaVal >= 0) {
      totalCredits += crVal;
      totalGradePoints += sgpaVal * crVal;
      validSemestersCount++;
    }
  }

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : null;

  // Target requirement calculation
  const target = parseFloat(targetCgpa);
  const remCr = parseFloat(remainingCredits);
  let requiredSgpa: number | null = null;
  if (!isNaN(target) && !isNaN(remCr) && remCr > 0 && cgpa !== null) {
    // (totalGradePoints + requiredSgpa * remCr) / (totalCredits + remCr) = target
    // totalGradePoints + requiredSgpa * remCr = target * (totalCredits + remCr)
    requiredSgpa = (target * (totalCredits + remCr) - totalGradePoints) / remCr;
  }

  const handleCopy = () => {
    if (cgpa === null) return;
    const text = `Current CGPA: ${cgpa.toFixed(2)} (Total Credits: ${totalCredits})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Input Table */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" /> Enter Semester GPA & Credits
            </h3>
            <button
              type="button"
              onClick={addSemester}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Semester
            </button>
          </div>

          <div className="space-y-2.5">
            {semesters.map((sem, idx) => (
              <div
                key={sem.id}
                className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80"
              >
                <span className="w-24 text-xs font-semibold text-slate-300 shrink-0">
                  {sem.name}
                </span>

                <div className="flex-1">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="SGPA (e.g. 8.5)"
                    value={sem.sgpa}
                    onChange={(e) => updateSemester(sem.id, 'sgpa', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="w-28">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Credits"
                    value={sem.credits}
                    onChange={(e) => updateSemester(sem.id, 'credits', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSemester(sem.id)}
                  disabled={semesters.length <= 1}
                  className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                  title="Remove semester"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output & Target Goal */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cumulative CGPA</span>
                <Award className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="text-5xl font-black font-mono text-indigo-400 tracking-tight my-2">
                {cgpa !== null ? cgpa.toFixed(2) : '—'}
              </div>

              <div className="text-xs text-slate-400 space-y-1 mt-3">
                <div className="flex justify-between">
                  <span>Total Credits Completed:</span>
                  <span className="font-mono text-slate-200">{totalCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semesters Calculated:</span>
                  <span className="font-mono text-slate-200">{validSemestersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equivalent CBSE %:</span>
                  <span className="font-mono text-emerald-400">
                    {cgpa !== null ? `${(cgpa * 9.5).toFixed(2)}%` : '—'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={cgpa === null}
              onClick={handleCopy}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy CGPA'}
            </button>
          </div>

          {/* Goal Simulator */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Target CGPA Planner
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Remaining Credits</label>
                <input
                  type="number"
                  step="1"
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {requiredSgpa !== null && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                {requiredSgpa > 10 ? (
                  <span className="text-rose-400">
                    Requires SGPA of {requiredSgpa.toFixed(2)} (not achievable within 10.0 scale).
                  </span>
                ) : requiredSgpa <= 0 ? (
                  <span className="text-emerald-400">Target already secured!</span>
                ) : (
                  <span className="text-slate-300">
                    You need an average SGPA of{' '}
                    <strong className="text-emerald-400 font-mono text-sm">{requiredSgpa.toFixed(2)}</strong> across the
                    remaining {remainingCredits} credits.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
