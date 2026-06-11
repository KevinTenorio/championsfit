import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { RosterProvider } from "@/context/RosterContext";

export const metadata: Metadata = {
  title: "ChampionsFit — VGC Team Finder for Pokémon Champions",
  description:
    "Find tournament teams from the VGC community that match your Pokémon Champions roster. Filter by coverage, Featured teams, required Pokémon, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <RosterProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-gray-800 mt-12">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-gray-600">
              <p>
                Team data sourced from{" "}
                <a
                  href="https://docs.google.com/spreadsheets/d/1axlwmzPA49rYkqXh7zHvAtSP-TKbM0ijGYBPRflLSWw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300 underline underline-offset-2"
                >
                  VGCPastes
                </a>
                , maintained by the VGC community.
              </p>
              <p className="mt-1">Pokémon and all related names, characters, and imagery are © Nintendo / Creatures Inc. / GAME FREAK inc. This is a fan-made tool, not affiliated with or endorsed by Nintendo or The Pokémon Company.</p>
            </div>
          </footer>
        </RosterProvider>
      </body>
    </html>
  );
}
