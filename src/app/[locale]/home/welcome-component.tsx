// HomePageContent.tsx

'use client'

import { useState, useEffect, useMemo, useCallback } from "react";
import { User } from '@/app/types/entities/user';
import { UserNav } from '@/app/[locale]/home/user-nav';
import { DataTable } from './data-table';
import { documents_columns } from '../../types/data-table/columns';
import { Document } from '../../types/entities/document';
import { useTranslations } from 'next-intl';
import { getMyDocuments } from "@/app/services/documentService";
import { handleDelete as handleDeleteService } from "@/app/services/data-table-service";

export const HomePageContent = ({ user, locale }: { user: User, locale: string }) => {
  const t = useTranslations("Columns");
  
  // const [data, setData] = useState<Document[]>([]);
  
  // const handleDelete = useCallback((documentId: number) => {
  //   handleDeleteService(documentId, setData);
  // }, []);
  
  // const columns = useMemo(() => documents_columns(t, handleDelete), [t, handleDelete]);

  // useEffect(() => {
  //   getMyDocuments()
  //     .then((docs) => setData(docs))
  //     .catch((err) => console.error(err))
  // }, []);

  return (
    <main className="p-6">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back {user.email}!
            </h2>
            <p className="text-muted-foreground">
              Here's a list of your documents!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav user={user} locale={locale} />
          </div>
        </div>

          <DataTable />
      </div>
    </main>
  );
};