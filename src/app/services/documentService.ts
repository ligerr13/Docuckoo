import { Document } from "@/app/types/entities/document"
import { Document as AppDocument } from "../types/entities/document"

export async function getMyDocuments(): Promise<Document[]> {
  try {
    const res = await fetch("/api/documents/my-documents", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch documents")

    const data = await res.json()
    
    return data.data?.documents ?? []

  } catch (err) {
    return []
  }
}

export async function deleteDocument(documentId: number) {
  try {
    const res = await fetch(`/api/documents?id=${documentId}`, {
      method: "DELETE",
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Failed to delete document: ${res.status} ${res.statusText}`);
    } 

    return true;

  } catch (error) { 
    throw error; 
  }
}

export async function createDocument(newDocumentData: Partial<AppDocument>) {
  try {
    const expiresAt =
      newDocumentData.expiresAt instanceof Date
        ? newDocumentData.expiresAt.toISOString()
        : typeof newDocumentData.expiresAt === "string"
        ? new Date(newDocumentData.expiresAt).toISOString()
        : null;

    const payload = {
      title: newDocumentData.title,
      expiresAt,
    };

    const res = await fetch("/api/documents/new", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create document");
    }

    const data = await res.json();

    return data.data;

  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}


// export async function createDocument(newDocumentData:  Partial<AppDocument>) {
//   try {

//     const castedDate = newDocumentData.date instanceof Date 
//       ? newDocumentData.date.toISOString() 
//       : null;

      

//     const payload = {
//       title: newDocumentData.title,
//       expiresAt: castedDate
//     }

//     const res = await fetch('/api/documents/new', {
//       method: 'POST',
//       cache: "no-store",
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || `Failed to create document`);
//     }

//     const data = await res.json();
    
//     return data.data;

//   } catch (error) {
//     console.error("Error creating document:", error);
//     throw error;
//   }
// }