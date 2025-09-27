"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  pagination?: PaginationState;
  manualPagination?: boolean;
  totalRows?: number;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  onPaginationChange,
  sorting,
  columnFilters,
  columnVisibility,
  rowSelection,
  pagination,
  manualPagination = false,
  totalRows,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    onSortingChange,
    onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange,
    onRowSelectionChange,
    onPaginationChange,
    manualPagination,
    pageCount: Math.ceil((totalRows ?? 0) / (pagination?.pageSize ?? 10)),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Skeleton className="w-full h-24" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-20">
                <div className="flex flex-row w-full justify-between items-center">
                  <div className="flex w-full">
                    <span>
                      {manualPagination && table.getPageCount() ? (
                        <>
                          Mostrando{" "}
                          {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}{" "}
                          a{" "}
                          {Math.min(
                            table.getState().pagination.pageIndex *
                              table.getState().pagination.pageSize +
                              table.getState().pagination.pageSize,
                            table.getPageCount() *
                              table.getState().pagination.pageSize,
                          )}{" "}
                          de {totalRows}
                        </>
                      ) : (
                        <>
                          Mostrando{" "}
                          {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}{" "}
                          a{" "}
                          {Math.min(
                            table.getState().pagination.pageIndex *
                              table.getState().pagination.pageSize +
                              table.getState().pagination.pageSize,
                            table.getRowCount(),
                          )}{" "}
                          de {totalRows}
                        </>
                      )}
                    </span>
                  </div>
                  <Pagination>
                    <PaginationContent className="justify-end flex w-full">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (table.getCanPreviousPage()) {
                              table.previousPage();
                            }
                          }}
                          className={
                            !table.getCanPreviousPage()
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: Math.min(5, table.getPageCount()) },
                        (_, i) => {
                          const pageIndex = i;
                          return (
                            <PaginationItem key={pageIndex}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  table.setPageIndex(pageIndex);
                                }}
                                isActive={
                                  table.getState().pagination.pageIndex ===
                                  pageIndex
                                }
                                className="cursor-pointer"
                              >
                                {pageIndex + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        },
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (table.getCanNextPage()) {
                              table.nextPage();
                            }
                          }}
                          className={
                            !table.getCanNextPage()
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
