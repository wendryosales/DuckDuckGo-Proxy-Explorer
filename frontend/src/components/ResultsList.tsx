"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks/redux";
import { ExternalLink, SearchX } from "lucide-react";
import { useCallback, useMemo } from "react";

interface TextChunk {
  text: string;
  highlight: boolean;
  className?: string;
}

const createSingleChunk = (title: string): TextChunk[] => [
  {
    text: title,
    highlight: false,
  },
];

/**
 * Splits a text into chunks and highlights parts that match the search term.
 * Each matching term becomes a highlighted chunk, while non-matching parts
 * become regular chunks.
 *
 * @example
 * // For title "React and Redux" and highlightTerm "react"
 * // Returns: [
 * //   { text: "React", highlight: true, className: "highlight-class" },
 * //   { text: " and Redux", highlight: false }
 * // ]
 */
const createHighlightedChunks = (
  title: string,
  highlightTerm: string,
  resultIndex: number,
  getHighlightClass: (resultIndex: number, matchIndex: number) => string
): TextChunk[] => {
  const regex = new RegExp(`(${highlightTerm})`, "gi");
  const parts = title.split(regex);
  const chunks: TextChunk[] = [];
  let matchCount = 0;

  parts.forEach((part) => {
    if (!part) return;

    if (part.toLowerCase() === highlightTerm.toLowerCase()) {
      chunks.push({
        text: part,
        highlight: true,
        className: getHighlightClass(resultIndex, matchCount),
      });
      matchCount++;
    } else {
      chunks.push({
        text: part,
        highlight: false,
      });
    }
  });

  return chunks;
};

interface HighlightedTitleProps {
  chunks: TextChunk[];
}

const HighlightedTitle = ({ chunks }: HighlightedTitleProps) => (
  <h3 className="font-medium text-base text-foreground group-hover:text-primary transition-colors">
    {chunks.map((chunk, i) => (
      <span key={i} className={chunk.highlight ? chunk.className : undefined}>
        {chunk.text}
      </span>
    ))}
  </h3>
);

interface ResultCardProps {
  result: {
    title: string;
    url: string;
    category?: string;
  };
  chunks: TextChunk[];
  resultIndex: number;
}

const ResultCard = ({ result, chunks, resultIndex }: ResultCardProps) => (
  <Card
    data-result-index={resultIndex}
    className="border-border/40 hover:border-border/80 transition-all hover:bg-accent/5 dark:hover:bg-accent/10"
  >
    <CardContent className="pt-6">
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="flex items-center gap-2">
          <HighlightedTitle chunks={chunks} />
          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
        </div>
        {result.category && (
          <p className="mt-2 text-sm text-muted-foreground/80">
            in {result.category}
          </p>
        )}
      </a>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="min-h-[50vh] space-y-4">
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
    <Skeleton data-testid="loading-skeleton" className="h-12 w-full" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-[50vh]">
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <p className="text-destructive">Error: {message}</p>
      </CardContent>
    </Card>
  </div>
);

const NoResults = ({ query }: { query: string }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
    <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
    <h2 className="text-xl font-semibold mb-2">No results found</h2>
    <p className="text-muted-foreground max-w-md">
      We couldn&apos;t find any matches for &quot;{query}&quot;. Try different
      or more general keywords.
    </p>
  </div>
);

export function ResultsList() {
  const { results, isLoading, error, currentQuery } = useAppSelector(
    (state) => state.searchResults
  );
  const { highlightPattern: highlightTerm, selectedMatch: currentHighlight } =
    useAppSelector((state) => state.highlight);

  const getHighlightClass = useCallback(
    (resultIndex: number, matchIndex: number): string => {
      return cn(
        "search-highlight rounded px-1 py-0.5",
        "bg-purple-500/15 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300",
        currentHighlight.resultIndex === resultIndex &&
          currentHighlight.matchIndex === matchIndex &&
          "bg-purple-500/30 dark:bg-purple-500/50 text-purple-800 dark:text-purple-200 ring-2 ring-purple-500/50"
      );
    },
    [currentHighlight]
  );

  const allChunks = useMemo(() => {
    const chunksMap = new Map<number, TextChunk[]>();

    results.forEach((result, resultIndex) => {
      const chunks = !highlightTerm
        ? createSingleChunk(result.title)
        : createHighlightedChunks(
            result.title,
            highlightTerm,
            resultIndex,
            getHighlightClass
          );

      chunksMap.set(resultIndex, chunks);
    });

    return chunksMap;
  }, [results, highlightTerm, getHighlightClass]);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!results.length) return <NoResults query={currentQuery} />;

  return (
    <div className="min-h-[50vh] space-y-4">
      {results.map((result, resultIndex) => (
        <ResultCard
          key={resultIndex}
          result={result}
          chunks={allChunks.get(resultIndex) || []}
          resultIndex={resultIndex}
        />
      ))}
    </div>
  );
}
