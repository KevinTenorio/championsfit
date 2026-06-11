"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Teams" },
  { href: "/roster", label: "My Roster" },
  { href: "/recruitment", label: "Recruitment" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <span className="flex items-center gap-1.5 font-bold text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
            <path d="M4 28 L28 28 L28 22 L26 10 L21 18 L16 4 L11 18 L6 10 L4 22 Z" fill="#FBBF24"/>
            <circle cx="16" cy="24.5" r="2.2" fill="#EF4444"/>
            <circle cx="9.5" cy="24.5" r="1.6" fill="#EF4444"/>
            <circle cx="22.5" cy="24.5" r="1.6" fill="#EF4444"/>
          </svg>
          ChampionsFit
        </span>
        <nav className="flex gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? "text-white font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
