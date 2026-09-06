import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check, GraduationCap, Award } from 'lucide-react';

interface GpaCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export default function GpaCalculator({ onCopy }: GpaCalculatorProps) {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Computer Science 101', grade: 'A', credits: '4' },
    { id: '2', name: 'Calculus I', grade: 'A-', credits: '4' },
    { id: '3', name: 'Physics & Lab', grade: 'B+', credits: '4' },
    { id: '4', name: 'Academic Writing', grade: 'A', credits: '3' },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  const addCourse = () => {
    const nextNum = courses.length + 1;
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Course ${nextNum}`, grade: 'A', credits: '3' },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: 'name' | 'grade' | 'credits', val: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  let totalCredits = 0;
  let totalPoints = 0;

  for (const c of courses) {
    const pts = GRADE_POINTS[c.grade] ?? 0;
    const cr = parseFloat(c.credits) || 0;
    totalCredits += cr;
    totalPoints += pts * cr;
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : null;

  let honors = '';
  if (gpa !== null) {
    if (gpa >= 3.9) honors = 'Summa Cum Laude';
    else if (gpa >= 3.7) honors = 'Magna Cum Laude';
    else if (gpa >= 3.5) honors = 'Cum Laude / Dean\'s List';
    else if (gpa >= 3.0) honors = 'Good Academic Standing';
    else if (gpa >= 2.0) honors = 'Satisfactory Academic Progress';
    else honors = 'Academic Warning / Probation';
  }

  const handleCopy = () => {
    if (gpa === null) return;
    const text = `GPA: ${gpa.toFixed(2)} / 4.0 (${honors}, Total Credits: ${totalCredits})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List Input */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> College Courses (4.0 Scale)
            </h3>
            <button
              type="button"
              onClick={addCourse}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>

          <div className="space-y-2.5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-2.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Course name"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="w-24">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Credits"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                  className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                  title="Remove course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Result Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall GPA</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="text-5xl font-black font-mono text-indigo-400 tracking-tight my-2">
              {gpa !== null ? gpa.toFixed(2) : '—'}
              <span className="text-lg text-slate-500 font-normal"> / 4.0</span>
            </div>

            <div className="mt-3 px-3 py-2 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300">
              {honors}
            </div>

            <div className="text-xs text-slate-400 space-y-1.5 mt-5">
              <div className="flex justify-between">
                <span>Total Credit Hours:</span>
                <span className="font-mono text-slate-200">{totalCredits}</span>
              </div>
              <div className="flex justify-between">
                <span>Quality Points Earned:</span>
                <span className="font-mono text-slate-200">{totalPoints.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={gpa === null}
            onClick={handleCopy}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy GPA Summary'}
          </button>
        </div>
      </div>
    </div>
  );
}
