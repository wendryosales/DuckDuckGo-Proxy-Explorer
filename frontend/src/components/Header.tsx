"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto px-4">
      <nav className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex-shrink-0 w-10 h-10 relative">
            <Image src="/duck-logo.svg" alt="Duck Search Logo" fill />
          </div>
          <span className="font-semibold text-xl hidden sm:inline-block">
            Duck Search
          </span>
        </Link>

        <div className="flex-1 max-w-xl mx-6">
          <SearchBar />
        </div>

        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
