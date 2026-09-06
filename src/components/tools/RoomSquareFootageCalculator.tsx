import React, { useState } from 'react';
import { Home, Plus, Trash2, Copy, Check, DollarSign } from 'lucide-react';

interface RoomSquareFootageCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

interface Room {
  id: string;
  name: string;
  length: string;
  width: string;
}

export default function RoomSquareFootageCalculator({ onCopy }: RoomSquareFootageCalculatorProps) {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'Living Room', length: '18', width: '14' },
    { id: '2', name: 'Master Bedroom', length: '14', width: '12' },
    { id: '3', name: 'Kitchen', length: '12', width: '10' },
  ]);
  const [pricePerUnit, setPricePerUnit] = useState<string>('3.50');
  const [copied, setCopied] = useState<boolean>(false);

  const addRoom = () => {
    const nextNum = rooms.length + 1;
    setRooms((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Room ${nextNum}`, length: '10', width: '10' },
    ]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoom = (id: string, field: 'name' | 'length' | 'width', val: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  let totalArea = 0;
  for (const r of rooms) {
    const l = parseFloat(r.length) || 0;
    const w = parseFloat(r.width) || 0;
    totalArea += l * w;
  }

  const sqFt = unit === 'ft' ? totalArea : totalArea * 10.7639;
  const sqM = unit === 'm' ? totalArea : totalArea * 0.092903;

  const costPerUnit = parseFloat(pricePerUnit) || 0;
  const totalCost = totalArea * costPerUnit;

  const handleCopy = () => {
    const text = `Total Area: ${sqFt.toFixed(1)} sq ft (${sqM.toFixed(1)} m²) across ${rooms.length} rooms. Estimated Material Cost: $${totalCost.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Switcher */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400">
          <Home className="w-5 h-5" />
          <span className="text-sm font-semibold text-white">Room Square Footage & Cost Estimator</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('ft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'ft' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Feet (sq ft)
          </button>
          <button
            type="button"
            onClick={() => setUnit('m')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'm' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Meters (sq m)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rooms Table */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Room Dimensions</h3>
            <button
              type="button"
              onClick={addRoom}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room
            </button>
          </div>

          <div className="space-y-2.5">
            {rooms.map((room) => {
              const rArea = (parseFloat(room.length) || 0) * (parseFloat(room.width) || 0);
              return (
                <div
                  key={room.id}
                  className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80"
                >
                  <div className="w-36">
                    <input
                      type="text"
                      placeholder="Room name"
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder={`Length (${unit})`}
                      value={room.length}
                      onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder={`Width (${unit})`}
                      value={room.width}
                      onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                    />
                  </div>

                  <span className="w-24 text-right font-mono text-xs text-indigo-400 font-bold shrink-0">
                    {rArea.toFixed(1)} {unit}²
                  </span>

                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    disabled={rooms.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <label className="text-xs text-slate-400">Estimated Cost per {unit === 'ft' ? 'sq ft' : 'sq m'}:</label>
            <div className="w-32">
              <input
                type="number"
                step="0.5"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs text-right"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Total Surface Area
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {sqFt.toFixed(1)}
              <span className="text-lg font-normal text-slate-400"> sq ft</span>
            </div>

            <div className="space-y-3 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Metric Equivalent:</span>
                <span className="font-bold text-white">{sqM.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Rooms Count:</span>
                <span className="font-bold text-white">{rooms.length} rooms</span>
              </div>
              {costPerUnit > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Material Cost:</span>
                  <span className="font-bold text-emerald-400 font-mono">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Footage & Estimate'}
          </button>
        </div>
      </div>
    </div>
  );
}
