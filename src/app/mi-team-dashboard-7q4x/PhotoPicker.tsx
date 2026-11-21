"use client";

import { useEffect, useRef, useState } from "react";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG or WEBP allowed.";
  if (file.size > MAX_IMAGE_BYTES) return "File must be 5 MB or smaller.";
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_read_failed"));
    };
    img.src = url;
  });
}

// Shared by the Gallery tab's Add photo and the Blog editor's Featured
// image: a visible "Choose photo" button opens the file dialog (the real
// <input type="file"> stays in the DOM, sr-only, never display:none), plus
// a drag-and-drop zone and a preview once a file is chosen.
export function PhotoPicker({
  file,
  onFile,
}: {
  file: File | null;
  onFile: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (picked: File | null) => {
    if (!picked) {
      setPickError(null);
      onFile(null);
      return;
    }
    const err = validateImageFile(picked);
    if (err) {
      setPickError(err);
      onFile(null);
      return;
    }
    setPickError(null);
    onFile(picked);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          pick(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-md border border-grey/30 p-2">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-16 w-16 rounded object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink">{file.name}</p>
            <p className="text-xs text-grey">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => pick(null)}
            className="text-xs font-medium text-secondary hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            pick(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`flex flex-col items-center gap-2 rounded-md border-2 border-dashed p-4 text-center ${
            dragOver ? "border-primary bg-primary/5" : "border-grey/30"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-grey/30 px-3 py-1.5 text-xs font-medium text-ink hover:bg-grey/5"
          >
            Choose photo
          </button>
          <p className="text-xs text-grey">or drag a photo here</p>
        </div>
      )}
      {pickError && <p className="mt-1 text-xs text-red-600">{pickError}</p>}
    </div>
  );
}
