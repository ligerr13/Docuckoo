import { createDocument, deleteDocument, getMyDocuments } from "@/app/services/documentService"
import { Document as AppDocument } from "../types/entities/document"
import { DeletableEntity } from "../types/data-table/deletableEntity";

export const handleDelete = async <T extends DeletableEntity>(
  documentId: number,
  setData: React.Dispatch<React.SetStateAction<T[]>>
) => {
  setData(currentData =>
    currentData.map(doc =>
      doc.documentId === documentId ? { ...doc, isDeleting: true } : doc
    )
  );

  try {
    await deleteDocument(documentId);

    setData(currentData =>
      currentData.filter(doc => doc.documentId !== documentId)
    );
  } catch (error) {
    setData(currentData =>
      currentData.map(doc =>
        doc.documentId === documentId ? { ...doc, isDeleting: false } : doc
      )
    );
    console.error("An error has happened while deleting the document", error);
  }
};


export const handleAddDocument = async (
  newDocumentData: Partial<AppDocument>,
  setData: React.Dispatch<React.SetStateAction<AppDocument[]>>
) => {
  try {
    const createdDocument = await createDocument(newDocumentData);

    setData((prev) => [
      ...prev,
      {
        documentId: createdDocument.id,
        title: createdDocument.documentTitle,
        status: [{ statusName: createdDocument.documentStatus.name, statusChangedAt: new Date().toISOString(), comment: null }],
        expiresAt: createdDocument.expiresAt
          ? new Date(createdDocument.expiresAt)
          : undefined,
      },
    ]);
  } catch (error) {
    console.error("An error has happened while adding the document", error);
  }
};