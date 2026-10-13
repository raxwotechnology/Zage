"use client";

import React from "react";
import Image from "next/image";

interface LuxuryPreloaderProps {
  label?: string;
  tagline?: string;
  fullScreen?: boolean;
}

export default function LuxuryPreloader({
  label = "Loading your experience...",
  tagline = "LOOK BEAUTIFUL • FEEL CONFIDENT",
  fullScreen = true,
}: LuxuryPreloaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${
        fullScreen ? "fixed inset-0 z-[99999]" : "relative w-full py-16"
      } flex flex-col items-center justify-center bg-[#070908] text-stone-200 overflow-hidden select-none`}
    >
      {/* 1. Ambient Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Primary Emerald Aura */}
        <div className="w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-tr from-[#03BF62]/15 via-emerald-500/10 to-teal-400/5 blur-[100px] sm:blur-[130px] animate-pulse" />
        {/* Subtle Secondary Golden/Teal Shimmer */}
        <div className="absolute w-[260px] h-[260px] rounded-full bg-emerald-400/5 blur-[80px]" />
      </div>

      {/* 2. Glassmorphic Luxury Container */}
      <div className="relative z-10 flex flex-col items-center px-8 py-10 sm:px-12 sm:py-12 rounded-3xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),0_0_80px_rgba(3,191,98,0.12)] max-w-sm sm:max-w-md mx-4 text-center">
        {/* 3. Orbital Ring Loader */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-7">
          {/* Subtle Outer Aura Glow */}
          <div className="absolute inset-0 rounded-full bg-[#03BF62]/15 blur-xl animate-pulse" />

          {/* SVG Animated Orbit Rings */}
          <svg
            className="w-full h-full transform -rotate-90 overflow-visible"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="luxury-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#03BF62" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="luxury-accent-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="100%" stopColor="#03BF62" />
              </linearGradient>
            </defs>

            {/* Static Background Track Ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="2.5"
            />

            {/* Inner Subtle Track */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1.5"
            />

            {/* Primary Spinning Sweep Arc (Clockwise) */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#luxury-ring-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="180 84"
              className="salvora-orbit-clockwise"
            />

            {/* Secondary Counter-rotating Accent Arc */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="url(#luxury-accent-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100 114"
              className="salvora-orbit-counter"
            />
          </svg>

          {/* Center Emblem: Luxury Shears & Sparkle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#03BF62]/30 shadow-[0_0_20px_rgba(3,191,98,0.25)]">
              {/* Stylized Modern Shears SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#03BF62] transition-transform duration-700 salvora-snip-pulse"
              >
                <circle cx="6" cy="6" r="3" />
                <path d="M8.12 8.12 12 12" />
                <path d="M20 4 8.12 15.88" />
                <circle cx="6" cy="18" r="3" />
                <path d="M14.8 14.8 20 20" />
              </svg>

              {/* Little Sparkle Accent */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full blur-[1px] animate-ping" />
            </div>
          </div>
        </div>

        {/* 4. Brand Logo & Title */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2 flex items-center justify-center">
            <Image
              src="/images/salvora-logo-dark.png"
              alt="SALVORA"
              width={180}
              height={50}
              priority
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_12px_rgba(3,191,98,0.2)]"
            />
          </div>

          {/* Tagline */}
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-[#03BF62] uppercase leading-tight mb-4">
            {tagline}
          </p>

          {/* 5. Modern Smooth Infinite Progress Bar */}
          <div className="w-48 sm:w-56 h-1 rounded-full bg-white/[0.06] overflow-hidden relative mb-3">
            <div className="salvora-progress-indicator absolute inset-y-0 rounded-full bg-gradient-to-r from-transparent via-[#03BF62] to-transparent w-full" />
          </div>

          {/* 6. Status Label with Live Pulsing Dot */}
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#03BF62] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#03BF62]" />
            </span>
            <span>{label}</span>
          </div>
        </div>
      </div>

      {/* Screen Reader Label */}
      <span className="sr-only">SALVORA - {label}</span>

      {/* Scoped Keyframe Animations */}
      <style>{`
        @keyframes salvora-clockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes salvora-counter {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes salvora-progress-slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes salvora-snip-gentle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.08) rotate(4deg);
          }
        }

        .salvora-orbit-clockwise {
          transform-origin: 50px 50px;
          animation: salvora-clockwise 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .salvora-orbit-counter {
          transform-origin: 50px 50px;
          animation: salvora-counter 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .salvora-progress-indicator {
          animation: salvora-progress-slide 1.8s ease-in-out infinite;
        }

        .salvora-snip-pulse {
          animation: salvora-snip-gentle 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .salvora-orbit-clockwise,
          .salvora-orbit-counter,
          .salvora-progress-indicator,
          .salvora-snip-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
