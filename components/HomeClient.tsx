"use client";

import { useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import ExtractedDataForm from "@/components/ExtractedDataForm";
import ExportButtons from "@/components/ExportButtons";
import type { TransportDocumentData } from "@/lib/types";

export default function HomeClient() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<TransportDocumentData | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleExtracted(result: { file: File; data: TransportDocumentData }) {
    setFile(result.file);
    setData(result.data);
    setDocumentId(null);
    setSaveError(null);
  }

  async function handleSave() {
    if (!file || !data) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(data));

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Uloženie zlyhalo.");
      }

      const { id } = await res.json();
      setDocumentId(id);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Nastala neznáma chyba.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <DocumentUpload onExtracted={handleExtracted} />

      {data && (
        <div className="mt-8 space-y-4">
          <ExtractedDataForm
            data={data}
            onChange={setData}
            onSave={handleSave}
            isSaving={isSaving}
            isSaved={!!documentId}
          />
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          {documentId && <ExportButtons documentId={documentId} />}
        </div>
      )}
    </>
  );
}
