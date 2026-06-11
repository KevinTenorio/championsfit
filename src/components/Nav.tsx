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
        <span className="font-bold text-yellow-400">ChampionsFit</span>
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
