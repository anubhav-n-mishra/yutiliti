import React, { useState, useMemo } from 'react';
import { GraduationCap, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface SchoolAgeEligibilityCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function SchoolAgeEligibilityCalculator({ onCopy }: SchoolAgeEligibilityCalculatorProps) {
  const [dob, setDob] = useState<string>('2020-05-10');
  const [academicYear, setAcademicYear] = useState<number>(2026);
  const [cutoffMonthDay, setCutoffMonthDay] = useState<string>('09-01'); // Sept 1 cutoff standard

  const eligibility = useMemo(() => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;

    const cutoffDate = new Date(`${academicYear}-${cutoffMonthDay}`);
    
    // Calculate age as of cutoff date
    let age = cutoffDate.getFullYear() - birthDate.getFullYear();
    const m = cutoffDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && cutoffDate.getDate() < birthDate.getDate())) {
      age--;
    }

    let grade = '';
    let status = '';
    let minAge = 0;

    if (age < 3) {
      grade = 'Too Young for Preschool';
      status = 'Early Childhood / Home Care';
    } else if (age === 3) {
      grade = 'Preschool / Nursery (Pre-K3)';
      status = 'Eligible for Preschool (3yo)';
    } else if (age === 4) {
      grade = 'Pre-Kindergarten (Pre-K4)';
      status = 'Eligible for Pre-K (4yo)';
    } else if (age === 5) {
      grade = 'Kindergarten';
      status = 'Eligible for Kindergarten';
    } else if (age >= 6 && age <= 18) {
      const schoolGrade = age - 5;
      grade = `${schoolGrade}${schoolGrade === 1 ? 'st' : schoolGrade === 2 ? 'nd' : schoolGrade === 3 ? 'rd' : 'th'} Grade`;
      status = `Eligible for ${grade}`;
    } else {
      grade = 'Post Secondary / Adult';
      status = 'High School Graduate equivalent age';
    }

    return {
      ageAtCutoff: age,
      cutoffDateFormatted: cutoffDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      grade,
      status,
    };
  }, [dob, academicYear, cutoffMonthDay]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Child & District Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Child Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">School Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value={2025}>2025 – 2026</option>
                <option value={2026}>2026 – 2027</option>
                <option value={2027}>2027 – 2028</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Cutoff Date</label>
              <select
                value={cutoffMonthDay}
                onChange={(e) => setCutoffMonthDay(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="09-01">Sept 1 (Most US/UK)</option>
                <option value="10-01">Oct 1</option>
                <option value="12-31">Dec 31 (Calendar yr)</option>
                <option value="03-31">March 31 (India)</option>
                <option value="06-01">June 1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {eligibility ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">School Placement</span>
                <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                  {eligibility.grade}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Child will be {eligibility.ageAtCutoff} years old as of cutoff date ({eligibility.cutoffDateFormatted}).
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {eligibility.status}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Child Placement for ${academicYear}: ${eligibility.grade} (${eligibility.ageAtCutoff} years old at cutoff)`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Placement Status
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Please enter a valid birth date.</div>
          )}
        </div>
      </div>
    </div>
  );
}
