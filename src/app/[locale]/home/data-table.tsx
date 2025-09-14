'use client'
import React, { useCallback, useEffect, useMemo, useState } from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  ColumnFiltersState,
  getFacetedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableToolbar } from "./data-table-tool-bar"
import { DataTablePagination } from "./data-table-pagination"
import { deleteDocument, getMyDocuments } from "@/app/services/documentService"
import { handleAddDocument, handleDelete as handleDeleteService } from "@/app/services/data-table-service";
import { documents_columns } from "@/app/types/data-table/columns"
import { useTranslations } from "next-intl"
import { Document } from "@/app/types/entities/document"

export function DataTable(){

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = useState<Document[]>([]);
  const t = useTranslations("Columns");
  
  const handleDelete = useCallback((documentId: number) => {
    handleDeleteService(documentId, setData);
  }, []);

  const handleAdd = useCallback((doc: Partial<Document>) => {
      handleAddDocument(doc, setData);
  }, []); 
  
  useEffect(() => {
    getMyDocuments()
      .then((docs) => setData(docs))
      .catch((err) => console.error(err))
  }, []);
  
  const columns = useMemo(() => documents_columns(t), [t]);

  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state:{ sorting, columnFilters, columnVisibility, rowSelection },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      meta: {
        deleteOneDocument: async (documentId: number) => {
          await handleDelete(documentId);
        },
        addOneDocument: async (doc: Partial<Document>) => {
          await handleAdd(doc);
        }
      }
})

    return (
      <div className="flex flex-col gap-5">
        <DataTableToolbar table={table} />
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {
                table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {
                      headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {
                              header.isPlaceholder ? null : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            }
                          </TableHead>
                        )
                      })
                    }
                  </TableRow>
                ))
              }
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    );
  }