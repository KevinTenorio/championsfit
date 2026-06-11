"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options?: string[];
}

export function PokemonFilter({ label, value, onChange, options = [] }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = options
    .filter(
      (o) =>
        o.toLowerCase().includes(input.toLowerCase()) &&
        !value.includes(o)
    )
    .slice(0, 8);

  function add(name: string) {
    const trimmed = name.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (suggestions.length > 0) add(suggestions[0]);
      else if (input.trim()) add(input);
    }
    if (e.key === "Escape") setOpen(false);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef}>
      <label className="mb-1 block text-xs text-gray-400">{label}</label>

      <div className="relative">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search Pokémon..."
          className="w-48 rounded bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-gray-600"
        />

        {open && input.length > 0 && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-48 rounded border border-gray-700 bg-gray-900 py-1 shadow-lg">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    add(s);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
