"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUpgradeUrl(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("errorUnsupportedType"));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t("errorTooLarge"));
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
        if (body?.upgradeUrl) setUpgradeUrl(body.upgradeUrl);
        throw new Error(body?.error || t("errorExtractionFailed"));
      }

      const { data } = await res.json();
      onExtracted({ file, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorUnknown"));
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
            ? "border-primary bg-primary/10"
            : "border-border bg-card hover:border-muted-foreground"
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
          <p className="text-sm text-muted-foreground">{t("extracting")}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">{t("dragHint")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("clickHint")}</p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-destructive">
          {error}
          {upgradeUrl && (
            <>
              {" "}
              <Link href={upgradeUrl} className="underline">
                {t("upgradeLink")}
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
