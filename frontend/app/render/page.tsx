"use client";

import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";

export default function Main() {
  const [selectedFile, setSelectedfile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const retrievePresignedURL = async (file: File) => {
    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: file.name }),
      });

      const responseData = await response.json();
      return { url: responseData.url, error: null };
    } catch (error) {
      return { url: null, error: error };
    }
  };

  const uploadFileToMinio = useCallback(async (file: File) => {
    const { url, error } = await retrievePresignedURL(file);

    if (error || !url) {
      toast.error("Failed to get upload URL");
      return;
    }

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          toast.success("File uploaded successfully!");
          setUploadProgress(100);
        } else {
          toast.error("Upload failed");
        }
      };

      xhr.onerror = () => {
        toast.error("Error uploading file");
      };

      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(file);
    } catch (error) {
      console.log(error);
      toast.error("Upload failed. Please try again.");
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (
        file &&
        (file.name.endsWith(".fbx") ||
          file.name.endsWith(".blend") ||
          file.name.endsWith(".zip"))
      ) {
        setSelectedfile(file);
        uploadFileToMinio(file);
      } else {
        toast.error("Invalid file", {
          description: "Please upload a .fbx, .blend, or .zip file",
        });
      }
    },
    [uploadFileToMinio],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/octet-stream": [".fbx", ".blend", ".zip"],
    },
    multiple: false,
  });

  return (
    <div className="max-w-screen-xl flex gap-4 flex-col justify-center items-center h-screen min-w-full">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">3D Model Renderer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your 3D models and create stunning renders with our advanced
          rendering engine.
        </p>
      </div>

      {!selectedFile && (
        <div className="w-full max-w-2xl mx-auto hover:cursor-pointer">
          <div
            {...getRootProps()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`dropzone ${
              isDragActive || isHovered ? "active" : ""
            } group`}
          >
            <input {...getInputProps()} className="gap-2" />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 my-2">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center py-2 my-2">
                <h3 className="text-lg font-semibold">
                  Drag & Drop your 3D model here
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or click here to select & upload files
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-1/4 mx-auto flex flex-col">
          <div className="text-center mb-4">Uploading</div>
          <Progress
            value={uploadProgress}
            className="h-2 bg-gray-300 [&>div]:bg-green-500"
          />
        </div>
      )}
    </div>
  );
}
