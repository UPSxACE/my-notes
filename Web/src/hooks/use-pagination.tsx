"use client";

import { minCap, minMaxCap } from "@/utils/min-max-cap";
import { useEffect, useState } from "react";

export default function usePagination<T>(
  data: T[] | undefined | null,
  pageSize: number,
  initialPage?: number
) {
  const dataCalculated = data || [];
  const totalPages = minCap(Math.ceil(dataCalculated.length / pageSize), 1);
  const initialPageCalculated = initialPage
    ? minMaxCap(initialPage, 1, totalPages)
    : 1;

  const [selectedPage, setSelectedPage] = useState(initialPageCalculated);

  function setPage(page: number) {
    setSelectedPage((_) => minMaxCap(page, 1, totalPages));
  }

  function nextPage() {
    setSelectedPage((current) => minMaxCap(current + 1, 1, totalPages));
  }

  function previousPage() {
    setSelectedPage((current) => minMaxCap(current - 1, 1, totalPages));
  }

  const selectedPageCalculated = minMaxCap(selectedPage, 1, totalPages);

  useEffect(() => {
    // each time data changes, see if selectedPage needs to be adjusted!
    setSelectedPage(selectedPageCalculated);
  }, [data, selectedPageCalculated]);

  const previousPagesCount = selectedPageCalculated - 1;
  const previousPagesItemsCount = previousPagesCount * pageSize;
  const rangeStart = previousPagesItemsCount;
  const rangeEnd = previousPagesItemsCount + pageSize;

  return {
    currentPage: selectedPageCalculated,
    currentPageData: dataCalculated.slice(rangeStart, rangeEnd),
    totalPages,
    setPage,
    nextPage,
    previousPage,
  };
}
