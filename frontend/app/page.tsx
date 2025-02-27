"use client"

import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { RenderSettings } from '@/components/RenderSetting';
import { ModelPreview } from '@/components/ModelPreview';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);

  const handleRender = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a 3D model first",
        variant: "destructive"
      });
      return;
    }

    setIsRendering(true);
    toast({
      title: "Rendering started",
      description: "Your model is being rendered..."
    });

    // Simulate rendering process
    setTimeout(() => {
      setIsRendering(false);
      setRenderComplete(true);
      toast({
        title: "Rendering complete",
        description: "Your render is ready to download"
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 my-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">3D Model Renderer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your 3D models and create stunning renders with our advanced rendering engine.
          </p>
        </div>

        {!selectedFile && (
          <FileUpload onFileSelect={setSelectedFile} />
        )}

        {selectedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="preview-container">
                <ModelPreview file={selectedFile} />
              </div>
              
              {renderComplete && (
                <div className="flex justify-center">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Render
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <RenderSettings onRender={handleRender} />
              {isRendering && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <div className="loading-shimmer h-2 rounded-full" />
                  <p className="text-sm text-center mt-2">Rendering in progress...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;