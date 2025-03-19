"use client";

import { useState, useRef } from "react";
import { Upload, FileUp, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type UploadStage = "idle" | "selected" | "uploading" | "complete";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState<string>("720p");
  const [jobType, setJobType] = useState<string>("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [".fbx", ".blend"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStage("selected");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStage("selected");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getUploadUrl = async () => {
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ file_name: file.name }),
      });

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch Presigned URL");
      return null;
    }
  };

  const storeFileMetadataInDB = async () => {
    const response = await fetch("/api/files/raw", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ file_name: file?.name }),
    });

    if (!response.ok) {
      toast.error("Could not store file metadata to DB");
      return;
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setStage("uploading");
    setProgress(0);

    try {
      const uploadUrl = await getUploadUrl();

      if (!uploadUrl) {
        toast.error("Error while fetching URL");
        return;
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100,
          );
          setProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          await storeFileMetadataInDB();
          setProgress(100);
          setStage("complete");
          toast.success("File uploaded successfully!");
        } else {
          toast.error("Upload failed");
          setStage("selected");
        }
      };

      xhr.onerror = () => {
        toast.error("Error uploading file");
        setStage("selected");
      };

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(file);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
      setStage("selected");
    }
  };

  const submitRenderJob = () => {
    console.log("Submitting render job with resolution:", resolution);
  };

  const resetUpload = () => {
    setFile(null);
    setStage("idle");
    setProgress(0);
    setResolution("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            3D Model Uploader
          </h1>
          <p className="text-muted-foreground">
            Upload your 3D models (.fbx, .blend) for rendering
          </p>
        </div>
        <div className="space-y-6">
          {stage === "idle" || stage === "selected" ? (
            <Card>
              <CardContent className="p-6">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    "hover:border-primary/50 hover:bg-muted/50",
                    stage === "selected"
                      ? "border-primary/50 bg-muted/50"
                      : "border-muted-foreground/25",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={allowedFileTypes.join(",")}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-4">
                    {file ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileUp className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            Drag & drop your file here
                          </p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse (.fbx, .blend)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {file && stage === "selected" && (
                  <div className="mt-4 flex justify-end">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={resetUpload}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={uploadFile}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {stage === "uploading" && progress > 0 && progress < 100 && (
            <div className="w-1/4 mx-auto flex flex-col">
              <div className="text-center mb-4">Uploading</div>
              <Progress
                value={progress}
                className="h-2 bg-gray-300 [&>div]:bg-green-500"
              />
            </div>
          )}

          {stage === "complete" && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Upload complete</p>
                    <p className="text-sm text-muted-foreground">
                      {file?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Job Type
                    </label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="animation">Animation</SelectItem>
                      </SelectContent>
                    </Select>
                    <label className="text-sm font-medium">
                      Select Resolution
                    </label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="4k">4K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetUpload}>
                      Upload Another
                    </Button>
                    <Button onClick={submitRenderJob} disabled={!resolution}>
                      Render
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
