"use client";

import { useAction } from "convex/react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileUpload?: () => void;
};

export function UploadDialog({
    open,
    onOpenChange,
    onFileUpload
}: UploadDialogProps) {
    const addFile = useAction(api.private.files.addFile);

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        category: "",
        filename: "",
    });

    const handleFileDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (file) {
            setUploadedFiles([file]);
            if (!uploadForm.filename) {
                setUploadForm({ ...uploadForm, filename: file.name });
            }
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            const blob = uploadedFiles[0];

            if (!blob) {
               return; 
            }

            const filename = uploadForm.filename || blob.name;

            await addFile({
                bytes: await blob.arrayBuffer(),
                filename,
                mimeType: blob.type || "text/plain",
                category: uploadForm.category
            });

            onFileUpload?.();
            handleCancel();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }

    const handleCancel = () => {
        onOpenChange(false);
        setUploadedFiles([]);
        setUploadForm({ 
            category: "", 
            filename: "" 
        });
    }

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Upload Document
                    </DialogTitle>
                    <DialogDescription>
                        Upload documents to your Knowledge base for AI-powered search and
                        retrieval.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">
                            category
                        </Label>
                        <Input
                            className="w-full"
                            id="category"
                            onChange={(e) => setUploadForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                            }))}
                            placeholder="e.g., Documentation, Support, Product"
                            type="text"
                            value={uploadForm.category}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filename">
                            Filename{" "}
                            <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Input
                            className="w-full"
                            id="filename"
                            onChange={(e) => setUploadForm((prev) => ({
                                ...prev,
                                filename: e.target.value,
                            }))}
                            placeholder="Override default filename"
                            type="text"
                            value={uploadForm.filename}
                        />
                    </div>

                    <Dropzone
                        accept={{
                            "application/pdf": [".pdf"],
                            "text/csv": [".csv"],
                            "text/plain": [".txt"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
                        }}
                        disabled={isUploading}
                        maxFiles={1}
                        onDrop={handleFileDrop}
                        src={uploadedFiles}
                    >
                        <DropzoneEmptyState />
                        <DropzoneContent />
                    </Dropzone>
                </div>

                <DialogFooter>
                    <Button
                        disabled={isUploading}
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                       onClick={handleUpload}
                       disabled={uploadedFiles.length === 0 || isUploading || !uploadForm.category}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}