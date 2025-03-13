import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".fbx")) {
      simulateUpload(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a .fbx file",
        variant: "destructive",
      });
    }
  }, []);

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onFileSelect(file);
        toast({
          title: "Upload complete",
          description: "Your file has been uploaded successfully",
        });
      }
    }, 100);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/octet-stream": [".fbx"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} group`}
      >
        <input {...getInputProps()} className="gap-2" />
        <div className="flex flex-col items-center gap-4 ">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 my-2">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center py-2 my-2">
            <h3 className="text-lg font-semibold">
              Drag & Drop your 3D model here
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              or click to select files
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports .fbx files up to 100MB
            </p>
          </div>
          <Button variant="outline" className="mt-4 rounded-xl">
            <File className="w-4 h-4 mr-2" />
            Select File
          </Button>
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};
