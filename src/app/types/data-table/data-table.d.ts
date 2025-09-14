import { Document, newDocument } from "../entities/document";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    deleteOneDocument?: (documentId: number) => Promise<void>;
    addOneDocument?: (doc: newDocument) => Promise<void>;
  }
}
