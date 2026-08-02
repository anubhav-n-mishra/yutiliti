"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Home, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const TILE_ICONS = ["⚡", "🔧", "📊", "⚙️", "🔒", "🔑"];

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const deck = [...TILE_ICONS, ...TILE_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, flipped: false, matched: false }));
    setCards(deck);
    setSelectedCards([]);
    setMatchesCount(0);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selectedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) => (i === firstIdx || i === secondIdx ? { ...card, matched: true } : card))
          );
          setMatchesCount((count) => count + 1);
          setSelectedCards([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) => (i === firstIdx || i === secondIdx ? { ...card, flipped: false } : card))
          );
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Error 500
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Something Went Wrong</h1>
          <p className="mt-2 text-xs text-zinc-400">
            An unexpected error occurred. Play memory tile match while we recover!
          </p>
        </div>

        {/* Memory Game Board */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
            <span>Tile Matching Game</span>
            <span className="text-emerald-400 font-mono">Matches: {matchesCount} / {TILE_ICONS.length}</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-16 rounded-xl text-2xl font-bold transition-all duration-300 flex items-center justify-center border ${
                  card.flipped || card.matched
                    ? "bg-blue-600/20 border-blue-500/50 text-white scale-100"
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-transparent hover:scale-105"
                }`}
              >
                {card.flipped || card.matched ? card.icon : "❓"}
              </button>
            ))}
          </div>

          {matchesCount === TILE_ICONS.length && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Perfect! You solved all memory tiles!
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition"
          >
            <RefreshCw className="w-4 h-4" /> Try Reloading Page
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-800 hover:text-white transition"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
