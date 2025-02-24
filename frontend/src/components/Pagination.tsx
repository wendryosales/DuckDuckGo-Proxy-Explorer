"use client";

import { useAppSelector } from "@/store/hooks/redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export function PaginationComponent() {
  const { meta } = useAppSelector((state) => state.searchResults);
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!meta) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const totalPages = meta.lastPage;
    const currentPage = meta.currentPage;
    const maxVisible = 5;
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    // Ellipsis at the beginning
    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    // Pages in the middle
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Ellipsis at the end
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {meta.prev && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(meta.prev!);
              }}
            />
          </PaginationItem>
        )}

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis aria-label="More pages" />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === meta.currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {meta.next && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(meta.next!);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
