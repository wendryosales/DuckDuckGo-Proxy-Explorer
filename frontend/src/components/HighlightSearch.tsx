"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHighlight } from "@/hooks/useHighlight";
import { ChevronDown, ChevronUp, HighlighterIcon } from "lucide-react";

export function HighlightSearch() {
  const {
    highlightPattern,
    totalMatches,
    currentMatchNumber,
    navigateMatches,
    setHighlightPattern,
  } = useHighlight();

  return (
    <div className="flex items-center gap-2 mt-4">
      <div className="relative flex-1 max-w-sm">
        <HighlighterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          value={highlightPattern}
          onChange={(e) => setHighlightPattern(e.target.value)}
          placeholder="Highlight text..."
          className="pl-10"
        />
      </div>

      {highlightPattern && (
        <>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {totalMatches > 0
              ? `${currentMatchNumber} of ${totalMatches}`
              : "No matches"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMatches("prev")}
              disabled={!totalMatches}
              aria-label="Go to previous match"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMatches("next")}
              disabled={!totalMatches}
              aria-label="Go to next match"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
