"use client";

import React from "react";
import { SearchIcon, XIcon } from "@/components/ui/icons";

export interface FilterSearchButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  hasQuery?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function FilterSearchButton({
  isOpen,
  onToggle,
  hasQuery = false,
  label = "Search",
  ariaLabel = "Search",
  className = "",
}: FilterSearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className={`group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border bg-[#03BF62] text-white border-[#03BF62] hover:bg-[#029E51] shadow-xs active:scale-[0.98] ${className}`}
    >
      <SearchIcon
        data-icon-color="white"
        style={{ color: "#FFFFFF" }}
        className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white shrink-0"
      />
      <span>{label}</span>
      {hasQuery && !isOpen && (
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      )}
    </button>
  );
}

export interface FilterSearchInputProps {
  isOpen: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export function FilterSearchInput({
  isOpen,
  query,
  onQueryChange,
  onClear,
  placeholder = "Search...",
  ariaLabel = "Search",
  containerClassName = "w-full max-w-[700px] mx-auto mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-200",
  inputClassName = "",
}: FilterSearchInputProps) {
  if (!isOpen) return null;

  return (
    <div className={containerClassName}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4 h-4 w-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus
          className={`w-full rounded-2xl border border-stone-200 bg-stone-50/70 pl-11 pr-11 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:border-[#03BF62] focus:bg-white focus:ring-2 focus:ring-[#03BF62]/20 shadow-2xs ${inputClassName}`}
        />
        {query ? (
          <button
            type="button"
            onClick={onClear || (() => onQueryChange(""))}
            aria-label="Clear search"
            className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200/70 text-stone-500 hover:bg-stone-300 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
