'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Trash2, FileText, Copy, GripVertical } from "lucide-react"
import { CellContext, ColumnDef, HeaderContext, RowExpanding } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { statuses } from "./statuses"
import { Document } from "../entities/document"
import { Badge } from "@/components/ui/badge"
import { User } from "../entities/user"
import { UserModifiedByDetails } from "@/app/[locale]/home/user-details"

export const documents_columns = (
    translation: (key: string) => string,
    ): ColumnDef<Document>[] => [
    // {
    //     id: "drag",
    //     header: () => null,
    //     cell: ({ row }) => <DragHandle id={row.original.documentId} />,
    // },
    {
        id: "select",
        header: ({ table }) => (
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="px-2 text-left w-[10px]"
        />
        ),
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 80,
        minSize: 60
    },
    {
        accessorKey: "documentId",
        header: "Id",
    },
    {
        accessorKey: "assigned",
        header: "Assigned by",
        cell: ({ row }) => {
            const modifier: User = row.getValue('assigned');
            return <UserModifiedByDetails user={ modifier } />;
        },
    },
    {
        accessorKey: "title",
        header: ({
            column
        }) =>  {
            return (
                <Button 
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    {translation('column_header_title')}
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        size: 400,
        minSize: 200
    },
    {
        id: "status",
        accessorFn: (row: Document) => row.status?.[0]?.statusName,
        header: ({ column }: HeaderContext<Document, unknown>) => (
            <p>{translation('columns_header_status')}</p>
        ),
        cell: ({ row }: CellContext<Document, unknown>) => {
            const statusValue = row.getValue("status");
            const status = statuses.find((s) => s.value === statusValue);

            if (!status) return null;
            
            return (
                <Badge
                    variant="default"
                    className={`flex items-center w-[max-content]`}
                    style={{ backgroundColor: `${status.bgcolor}`, color: `${status.fgcolor}` }}
                >
                    <span className="text-s font-semibold">{status.label}</span>
                </Badge>
            );
        },
        size: 150,
        minSize: 120,
    },
    {
        id: "actions",
        header: () => <p>{translation('actions_header')}</p>,
        cell: ({ row, table }) => {
            const document = row.original
        
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant='ghost' className="h-8 w-8 p-0"    
                        >
                            <span className="sr-only" >
                                {translation('actions_open_menu')}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {translation('actions_header')}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(String(document.documentId))
                            }}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            {translation('actions_copy_document')}
                        </DropdownMenuItem>         
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            {translation('actions_show_details')}
                        </DropdownMenuItem>         
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            disabled={document.isDeleting}
                            variant="destructive"
                            onClick = {() => table.options.meta?.deleteOneDocument?.(document.documentId)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {translation('actions_delete_document')}
                        </DropdownMenuItem>         
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        size: 100,
        minSize: 80
    },
]