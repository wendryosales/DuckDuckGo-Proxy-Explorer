"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSearchTerm } from "@/store/features/search/searchResults/searchResultsSlice";
import { fetchHistory } from "@/store/features/search/searchResults/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function QueryHistory() {
  const { searchHistory } = useAppSelector((state) => state.searchResults);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const handleQueryClick = (query: string) => {
    dispatch(setSearchTerm(query));
    const params = new URLSearchParams();
    params.set("q", query);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card className="w-64 border-l custom-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Search History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {searchHistory.map((query, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleQueryClick(query)}
                className="w-full justify-start text-left hover-effect gap-2"
              >
                <Search className="h-4 w-4 shrink-0" />
                {query}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
