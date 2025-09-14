import { Table } from "@tanstack/react-table";
import { Column } from "@tanstack/react-table"
import { Document } from "../entities/document";

export type AddDocumentDialogProps = {
  addOneDocument: (doc: Partial<Document>) => Promise<void>;
};

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
}