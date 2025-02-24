"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { setSearchTerm } from "@/store/features/search/searchResults/searchResultsSlice";
import {
  fetchHistory,
  fetchSearchResults,
} from "@/store/features/search/searchResults/thunks";
import { useAppDispatch } from "@/store/hooks/redux";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function SearchBarContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [query, setQueryValue] = useState(searchParams.get("q") || "");

  const performSearch = useCallback(
    async (searchQuery: string, page = 1) => {
      if (!searchQuery.trim()) return;

      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (page > 1) params.set("page", page.toString());
      router.push(`/search?${params.toString()}`);

      dispatch(setSearchTerm(searchQuery));
      await dispatch(fetchSearchResults({ query: searchQuery, page }));
      dispatch(fetchHistory());
    },
    [dispatch, router]
  );

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlPage = Number(searchParams.get("page")) || 1;

    if (urlQuery) {
      setQueryValue(urlQuery);
      performSearch(urlQuery, urlPage);
    }
  }, [searchParams, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Search DuckDuckGo">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQueryValue(e.target.value)}
            placeholder="Search DuckDuckGo..."
            variant="search"
            aria-label="Search input"
          />
        </div>
        <Button type="submit" variant="search">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

export function SearchBar() {
  return (
    <Suspense fallback={<SearchBarSkeleton />}>
      <SearchBarContent />
    </Suspense>
  );
}
