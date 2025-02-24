"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HighlightSearch } from "@/components/HighlightSearch";
import { PaginationComponent } from "@/components/Pagination";
import { QueryHistory } from "@/components/QueryHistory";
import { ResultsList } from "@/components/ResultsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function SearchContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

function SearchContent() {
  return (
    <>
      <div className="sticky top-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
        <HighlightSearch />
      </div>
      <div className="pt-6">
        <ResultsList />
        <PaginationComponent />
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-4xl flex flex-col">
              <Suspense fallback={<SearchContentSkeleton />}>
                <SearchContent />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="shrink-0 hidden lg:block">
            <div className="sticky top-28">
              <Suspense fallback={<Skeleton className="h-[600px] w-64" />}>
                <QueryHistory />
              </Suspense>
            </div>
          </aside>
        </div>
      </main>

      <div className="w-full py-4 border-t mt-3">
        <Footer />
      </div>
    </div>
  );
}
