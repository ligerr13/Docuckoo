import { statuses } from '@/app/types/data-table/statuses'
import { DataTableToolbarProps } from '../../types/data-table/data-table-props'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Input } from '@/components/ui/input'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { AddDocumentDialog } from './data-table-add-document-popup'

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                <Input 
                    placeholder="Filter titles"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => 
                    table.getColumn("title")?.setFilterValue(e.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("status") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("status")}
                                title="Status"
                                options={statuses}
                            />
                    )}
            </div>
            <div className="flex items-center gap-2">
                <AddDocumentDialog addOneDocument={table.options.meta?.addOneDocument!}/>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className=" flex items-center h-8"
                        >
                            <SlidersHorizontal />
                            <p className="font-semibold">View</p>
                        </Button>
                    </DropdownMenuTrigger>
                
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter(
                            (column) => column.getCanHide()
                            )
                            .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}