"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import { uploadImageToUploadcare } from "@/lib/uploadcare";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

/**
 * Reusable image upload component using Uploadcare CDN.
 *
 * Features:
 * - Drag & drop support
 * - File type validation (JPEG, PNG, WebP only)
 * - File size validation (max 5MB)
 * - Multiple file upload
 * - Upload progress indication
 * - Preview with remove capability
 *
 * Uploaded image URLs are Uploadcare CDN URLs stored in MongoDB.
 * Example: https://ucarecdn.com/abc123-def456/
 */
export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (images.length + fileArray.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      setError("");
      setUploadProgress(0);

      const newUrls: string[] = [];
      const total = fileArray.length;

      for (let i = 0; i < total; i++) {
        try {
          const result = await uploadImageToUploadcare(fileArray[i]);
          newUrls.push(result.url);
          setUploadProgress(Math.round(((i + 1) / total) * 100));
        } catch (err: any) {
          setError(err.message || `Failed to upload ${fileArray[i].name}`);
          setUploading(false);
          // Still add successfully uploaded images
          if (newUrls.length > 0) {
            onImagesChange([...images, ...newUrls]);
          }
          return;
        }
      }

      onImagesChange([...images, ...newUrls]);
      setUploading(false);
      setUploadProgress(0);
    },
    [images, maxImages, onImagesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeImage = (idx: number) => {
    onImagesChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-24 w-32 overflow-hidden rounded-lg border border-gray-200"
            >
              <Image
                src={img}
                alt={`Uploaded image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="128px"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragActive
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              <span className="text-sm font-medium text-primary-600">
                Uploading... {uploadProgress}%
              </span>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Drag & drop images or click to browse
              </span>
              <span className="mt-1 text-xs text-gray-400">
                JPEG, PNG, WebP only &bull; Max 5MB per file &bull; {images.length}/{maxImages} uploaded
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {/* CDN info */}
      <p className="text-xs text-gray-400">
        Images are uploaded to Uploadcare CDN for fast global delivery.
        {/*
          PERFORMANCE: Uploadcare CDN URLs support on-the-fly transformations:
          - Resize: append /-/resize/800x600/ to the URL
          - WebP:   append /-/format/webp/ for smaller file sizes
          - Quality: append /-/quality/smart/ for adaptive compression
        */}
      </p>
    </div>
  );
}
