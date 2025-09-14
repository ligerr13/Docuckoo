'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { DatePicker } from "./date-picker-component";
import { FileDialog } from "./file-drop-zone-component";
import { AddDocumentDialogProps } from '@/app/types/data-table/data-table-props';

export function AddDocumentDialog(
  { addOneDocument }: AddDocumentDialogProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [titleError, setTitleError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const validateForm = () => {
    let hasError = false;
    if (title.trim() === '') {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }
    if (!date) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }
    
    return !hasError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addOneDocument({
        title,
        expiresAt: date?.toISOString(),
      });
      setIsOpen(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim() !== '') {
      setTitleError(false);
    }
  };
  
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setDateError(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate(undefined);
    setTitleError(false);
    setDateError(false);
  };

  return (
    <Dialog
        open={isOpen}
        onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                resetForm();
            }}}
        >
      <DialogTrigger asChild>
        <Button className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          <p className="font-semibold">Add Document</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Documents</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make a new document by filling the required fields and uploading your file (optional). Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Label className={`block text-center pr-3 ${titleError ? 'text-red-500' : 'text-muted-foreground'}`}>
            Enter the document title *
          </Label>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="title" className={`text-right pt-2 ${titleError ? 'text-red-500' : ''}`}>
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="E.g. annual report"
              className={`col-span-3 ${titleError ? 'border-red-500' : ''}`}
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <Label className={`block text-center pr-3 ${dateError ? 'text-red-500' : 'text-muted-foreground'}`}>
            Enter the document date *
          </Label>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="date" className={`text-right pt-2 ${dateError ? 'text-red-500' : ''}`}>
              Date
            </Label>
            <div className={`col-span-3 ${dateError ? 'border border-red-500 rounded-md' : ''}`}>
              <DatePicker selected={date} onSelect={handleDateChange} />
            </div>
          </div>
          <Label className="block text-center pl-7 text-muted-foreground">
            Upload the document (optional)
          </Label>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="upload" className="text-right pt-2">
              Upload
            </Label>
            <div className="col-span-3">
              <FileDialog />
            </div>
          </div>
          <Button type="submit">Add Document</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}