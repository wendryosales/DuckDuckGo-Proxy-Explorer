"use client";

import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/duck-logo.svg"
              alt="Duck Search Logo"
              width={80}
              height={80}
              priority
            />
            <h1 className="text-4xl font-bold tracking-tight">Duck Search</h1>
            <p className="text-muted-foreground">
              Your friendly search companion
            </p>
          </div>
          <SearchBar />
        </div>
      </div>

      <Footer />
    </div>
  );
}
