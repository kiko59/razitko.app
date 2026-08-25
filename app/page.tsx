"use client";

import { useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import ExtractedDataForm from "@/components/ExtractedDataForm";
import ExportButtons from "@/components/ExportButtons";
import type { TransportDocumentData } from "@/lib/types";

export default function HomePage() {
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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Razítko</h1>
      <p className="mt-1 text-sm text-slate-600">
        Nahraj prepravný dokument (CMR, BOL, dodací list) a automaticky z
        neho vyťaž kľúčové údaje.
      </p>

      <div className="mt-8">
        <DocumentUpload onExtracted={handleExtracted} />
      </div>

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
    </main>
  );
}
