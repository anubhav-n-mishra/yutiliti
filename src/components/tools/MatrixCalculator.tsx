import React, { useState } from 'react';
import { Grid, Copy, Check, RefreshCw } from 'lucide-react';

interface MatrixCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type Size = 2 | 3;
type Matrix = number[][];

export default function MatrixCalculator({ onCopy }: MatrixCalculatorProps) {
  const [size, setSize] = useState<Size>(2);

  const [matA, setMatA] = useState<Matrix>([
    [1, 2],
    [3, 4],
  ]);

  const [matB, setMatB] = useState<Matrix>([
    [5, 6],
    [7, 8],
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  // Resize handler
  const handleSizeChange = (newSize: Size) => {
    setSize(newSize);
    if (newSize === 2) {
      setMatA([
        [matA[0]?.[0] ?? 1, matA[0]?.[1] ?? 2],
        [matA[1]?.[0] ?? 3, matA[1]?.[1] ?? 4],
      ]);
      setMatB([
        [matB[0]?.[0] ?? 5, matB[0]?.[1] ?? 6],
        [matB[1]?.[0] ?? 7, matB[1]?.[1] ?? 8],
      ]);
    } else {
      setMatA([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      setMatB([
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1],
      ]);
    }
  };

  const updateCell = (matrix: 'A' | 'B', r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    if (matrix === 'A') {
      const next = matA.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? num : cell)));
      setMatA(next);
    } else {
      const next = matB.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? num : cell)));
      setMatB(next);
    }
  };

  // Determinant
  const det2x2 = (m: Matrix) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const det3x3 = (m: Matrix) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const detA = size === 2 ? det2x2(matA) : det3x3(matA);
  const detB = size === 2 ? det2x2(matB) : det3x3(matB);

  // Addition & Subtraction
  const addMat: Matrix = matA.map((row, r) => row.map((cell, c) => cell + matB[r][c]));
  const subMat: Matrix = matA.map((row, r) => row.map((cell, c) => cell - matB[r][c]));

  // Multiplication A * B
  const multMat: Matrix = Array.from({ length: size }, () => new Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < size; k++) {
        sum += matA[i][k] * matB[k][j];
      }
      multMat[i][j] = sum;
    }
  }

  // Transpose A
  const transposeA: Matrix = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => matA[c][r])
  );

  // Inverse of A (2x2)
  let invA: Matrix | null = null;
  if (size === 2 && detA !== 0) {
    invA = [
      [matA[1][1] / detA, -matA[0][1] / detA],
      [-matA[1][0] / detA, matA[0][0] / detA],
    ];
  }

  const handleCopyMatrix = (title: string, mat: Matrix) => {
    const text = `${title}:\n` + mat.map((row) => row.map((v) => Number(v.toFixed(3))).join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  const renderMatrixInput = (label: string, mat: Matrix, matKey: 'A' | 'B', det: number) => (
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">Matrix {matKey}</h4>
        <span className="text-xs font-mono text-indigo-400">det({matKey}) = {det}</span>
      </div>

      <div
        className="grid gap-2 mb-3"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {mat.map((row, r) =>
          row.map((val, c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              value={val}
              onChange={(e) => updateCell(matKey, r, c, e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center font-mono text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          ))
        )}
      </div>
    </div>
  );

  const renderMatrixResult = (title: string, mat: Matrix) => (
    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">{title}</span>
          <button
            type="button"
            onClick={() => handleCopyMatrix(title, mat)}
            className="text-slate-500 hover:text-white transition"
            title="Copy matrix"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        <div
          className="grid gap-1.5 font-mono text-xs text-center"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {mat.map((row, r) =>
            row.map((val, c) => (
              <div key={`${r}-${c}`} className="p-1.5 bg-slate-900 rounded border border-slate-800/80 text-white font-bold">
                {Number(val.toFixed(2))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dimension Switcher */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Matrix Dimension:</span>
          <button
            type="button"
            onClick={() => handleSizeChange(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              size === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2 × 2
          </button>
          <button
            type="button"
            onClick={() => handleSizeChange(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              size === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3 × 3
          </button>
        </div>
      </div>

      {/* Input Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMatrixInput('Matrix A', matA, 'A', detA)}
        {renderMatrixInput('Matrix B', matB, 'B', detB)}
      </div>

      {/* Results Grid */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4">Matrix Arithmetic & Transformation Results</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderMatrixResult('A + B (Addition)', addMat)}
          {renderMatrixResult('A - B (Subtraction)', subMat)}
          {renderMatrixResult('A × B (Multiplication)', multMat)}
          {renderMatrixResult('Aᵀ (Transpose of A)', transposeA)}
          {invA && renderMatrixResult('A⁻¹ (Inverse of A)', invA)}
        </div>
      </div>
    </div>
  );
}
