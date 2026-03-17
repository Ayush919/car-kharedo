"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface CarGalleryProps {
  images: string[];
  title: string;
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Use CDN images from Uploadcare, fall back to placeholder SVG
  const displayImages = images.length > 0 ? images : ["/placeholder-car.svg"];

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        {/* Main Image */}
        <div className="relative aspect-[16/10]">
          <Image
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Fullscreen button */}
          <button
            onClick={() => setFullscreen(true)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto p-3">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg ${
                  idx === currentIndex ? "ring-2 ring-primary-500" : "opacity-70"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute right-4 top-4 text-white"
            onClick={() => setFullscreen(false)}
          >
            <span className="text-3xl">&times;</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={displayImages[currentIndex]}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 text-sm text-white">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
