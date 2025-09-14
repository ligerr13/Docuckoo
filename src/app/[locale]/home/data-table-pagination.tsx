import { DataTablePaginationProps } from "@/app/types/data-table/data-table-props";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
          <div className="flex items-center justify-between py-4 m-[20px]">
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getRowModel().rows.length} row(s) selected.
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      table.previousPage();
                    }}
                    className={
                      table.getCanPreviousPage() ? "" : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={table.getState().pagination.pageIndex === i}
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(i);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      table.nextPage();
                    }}
                    className={
                      table.getCanNextPage() ? "" : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
)}