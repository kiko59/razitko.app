"use client";

import { useRef, useState } from "react";
import type { TransportDocumentData } from "@/lib/types";

interface DocumentUploadProps {
  onExtracted: (result: { file: File; data: TransportDocumentData }) => void;
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export default function DocumentUpload({ onExtracted }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Podporované sú len obrázky (JPEG, PNG, GIF, WebP) a PDF.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Súbor je príliš veľký (max 15 MB).");
      return;
    }

    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Extrakcia dát zlyhala.");
      }

      const { data } = await res.json();
      onExtracted({ file, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white hover:border-slate-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        {isExtracting ? (
          <p className="text-sm text-slate-600">
            Spracúvam dokument cez Claude…
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">
              Presuň sem CMR, BOL alebo dodací list
            </p>
            <p className="mt-1 text-xs text-slate-500">
              alebo klikni pre výber súboru (JPEG, PNG, PDF — max 15 MB)
            </p>
          </>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
