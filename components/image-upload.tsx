"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  // Function to handle file upload
  const uploadFile = (file: File) => {
    // Check file size (5 MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5 MB.")
      return
    }

    // Create a local preview for immediate feedback
    let localPreview = URL.createObjectURL(file)

    // Set uploading state
    setIsUploading(true)
    setUploadError(null)

    // This function is defined separately to use async/await
    const performUpload = async () => {
      try {
        // TODO: Replace with your actual upload implementation
        // For now, we'll just use the local preview after a delay to simulate upload
        // Simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 1000))

        // Your upload logic goes here
        const data = await uploadFileToIPFS(file);
        const uploadedUrl = data.url;

        setIsUploading(false)
        onImageSelected(uploadedUrl)
      } catch (error) {
        console.error("Upload error:", error)
        setIsUploading(false)
        setUploadError("Failed to upload image. Please try again.")
        // Still provide the local preview as fallback
        onImageSelected(localPreview)
      }
    }

    // Call the async function
    performUpload()
  }

  // Send file to API route
  const uploadFileToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://uploader.tctctcly.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data; // { success: true, url: '...' }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="font-medium">Uploading image...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-background p-3 border">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Upload your image</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your image here or click to browse</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 10MB)</p>
            </div>
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            <Button type="button" variant="outline" onClick={handleButtonClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </>
        )}
      </div>
    </div>
  )
}
