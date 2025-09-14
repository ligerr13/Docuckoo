import { statuses } from "../data-table/statuses"
import { User } from "./user"

export type Document = {
    documentId: number;
    title: String;
    status: DocumentStatus[];
    modifiedBy?: User;
    expiresAt?: Date | string | null;
    isDeleting?: boolean
}

export type DocumentStatus = {
    statusName: (typeof statuses)[number]['value'];
    statusChangedAt: string;
    comment: string | null;
};