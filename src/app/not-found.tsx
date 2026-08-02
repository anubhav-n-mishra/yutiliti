"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Home, Wrench, Trophy, Sparkles } from "lucide-react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("yuitility_404_highscore");
    if (saved) setHighScore(Number(saved));
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let currentScore = 0;

    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 35,
      width: 50,
      height: 16,
      speed: 7,
      dx: 0,
    };

    interface Item {
      x: number;
      y: number;
      radius: number;
      speed: number;
      isGlitch: boolean;
      symbol: string;
    }

    let items: Item[] = [];
    const symbols = ["🔧", "⚡", "📐", "⚙️", "📊", "💻"];

    const spawnItem = () => {
      const isGlitch = Math.random() < 0.25;
      items.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -10,
        radius: 12,
        speed: 2 + Math.random() * 2.5 + currentScore * 0.05,
        isGlitch,
        symbol: isGlitch ? "💥" : symbols[Math.floor(Math.random() * symbols.length)],
      });
    };

    let spawnTimer = setInterval(spawnItem, 800);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
      if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "ArrowRight" ||
        e.key === "d"
      ) {
        player.dx = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Touch controls for mobile
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      player.x = Math.max(0, Math.min(canvas.width - player.width, touchX - player.width / 2));
    };
    canvas.addEventListener("touchmove", handleTouchMove);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines
      ctx.strokeStyle = "rgba(100, 116, 139, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Update player
      player.x += player.dx;
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      // Draw player (paddle)
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, player.width, player.height, 8);
      ctx.fill();

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.symbol, item.x, item.y);

        // Collision check
        if (
          item.y + item.radius >= player.y &&
          item.x >= player.x &&
          item.x <= player.x + player.width
        ) {
          if (item.isGlitch) {
            setGameState("gameover");
            clearInterval(spawnTimer);
            cancelAnimationFrame(animationId);
            return;
          } else {
            currentScore += 10;
            setScore(currentScore);
            items.splice(i, 1);
            continue;
          }
        }

        // Missed bottom
        if (item.y > canvas.height + 20) {
          items.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("yuitility_404_highscore", String(score));
    }
  }, [score, highScore]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-6 z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            The tool or page you were looking for doesn't exist or has moved. Play a quick game while you're here!
          </p>
        </div>

        {/* Arcade Mini-Game Canvas Container */}
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center px-2 mb-3 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-1 text-blue-400">
              <Wrench className="w-3.5 h-3.5" /> Score: <span className="text-white font-mono text-base">{score}</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-3.5 h-3.5" /> High Score: <span className="text-white font-mono text-base">{highScore}</span>
            </span>
          </div>

          <div className="relative flex justify-center items-center rounded-xl bg-zinc-950 border border-zinc-800/80">
            <canvas
              ref={canvasRef}
              width={340}
              height={220}
              className="w-full max-w-[340px] h-[220px] rounded-xl cursor-crosshair"
            />

            {gameState === "start" && (
              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center rounded-xl">
                <p className="text-sm font-bold text-zinc-200">Catch Tools & Avoid Glitches 💥</p>
                <p className="text-xs text-zinc-500 mt-1 mb-4">Use Left/Right arrows or swipe on mobile</p>
                <button
                  onClick={startGame}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-95"
                >
                  Play Tool Catcher 🎮
                </button>
              </div>
            )}

            {gameState === "gameover" && (
              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center rounded-xl">
                <p className="text-lg font-black text-rose-500 mb-1">Game Over! 💥</p>
                <p className="text-xs text-zinc-400 mb-4">You scored <span className="text-white font-bold">{score}</span> points</p>
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition"
                >
                  <RefreshCw className="w-4 h-4" /> Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition shadow-md"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            href="/#tools"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-800 hover:text-white transition"
          >
            <Wrench className="w-4 h-4" /> Browse All 77+ Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
