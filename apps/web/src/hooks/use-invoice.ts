import { InvoiceService } from "@/services/invoices.service";
import { container } from "@/lib/di-container";
import { TYPES } from "@/lib/di-types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { InvoicesFiltersSchema, InvoiceStatus } from "@fullstack-q3/contracts";

export const useInvoice = (
  invoiceService: InvoiceService = container.get(TYPES.InvoiceService)
) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InvoiceStatus | undefined>(undefined);
  const [startsAt, setStartsAt] = useState<string | undefined>(undefined);
  const [endsAt, setEndsAt] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 750);

    return () => clearTimeout(timer);
  }, [search]);

  const invoicesQuery = useQuery({
    queryKey: ["invoices", page, status, startsAt, endsAt, debouncedSearch],
    queryFn: () => invoiceService.list(InvoicesFiltersSchema.parse({ page, status, start: startsAt, end: endsAt, search: debouncedSearch })),
    enabled: typeof window !== "undefined" && !!sessionStorage.getItem("accessToken"), 
  });

  const statsQuery = useQuery({
    queryKey: ["invoices-stats", startsAt, endsAt],
    queryFn: () => invoiceService.stats(InvoicesFiltersSchema.parse({ start: startsAt, end: endsAt })),
    enabled: typeof window !== "undefined" && !!sessionStorage.getItem("accessToken"), 
  });

  return {
    invoicesQuery,
    statsQuery,
    page,
    setPage,
    status,
    setStatus,
    startsAt,
    setStartsAt,
    endsAt,
    setEndsAt,
    search,
    setSearch,
  };
};
