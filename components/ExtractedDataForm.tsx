"use client";

import type { TransportDocumentData, DocumentType } from "@/lib/types";

interface ExtractedDataFormProps {
  data: TransportDocumentData;
  onChange: (data: TransportDocumentData) => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "CMR", label: "CMR" },
  { value: "BOL", label: "Bill of Lading (BOL)" },
  { value: "dodaci_list", label: "Dodací list" },
  { value: "iny", label: "Iný" },
];

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

export default function ExtractedDataForm({
  data,
  onChange,
  onSave,
  isSaving,
  isSaved,
}: ExtractedDataFormProps) {
  function update<K extends keyof TransportDocumentData>(
    key: K,
    value: TransportDocumentData[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Typ dokumentu
          </span>
          <select
            value={data.document_type}
            onChange={(e) =>
              update("document_type", e.target.value as DocumentType)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-md bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Odosielateľ</h3>
          <TextField
            label="Meno / názov"
            value={data.sender.name}
            onChange={(v) => update("sender", { ...data.sender, name: v })}
          />
          <TextField
            label="Adresa"
            value={data.sender.address}
            onChange={(v) => update("sender", { ...data.sender, address: v })}
          />
        </div>

        <div className="space-y-3 rounded-md bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Príjemca</h3>
          <TextField
            label="Meno / názov"
            value={data.recipient.name}
            onChange={(v) =>
              update("recipient", { ...data.recipient, name: v })
            }
          />
          <TextField
            label="Adresa"
            value={data.recipient.address}
            onChange={(v) =>
              update("recipient", { ...data.recipient, address: v })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Váha (kg)
          </span>
          <input
            type="number"
            value={data.weight_kg ?? ""}
            onChange={(e) =>
              update(
                "weight_kg",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <TextField
          label="Referenčné číslo"
          value={data.reference_number}
          onChange={(v) => update("reference_number", v)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Dátum nakládky
          </span>
          <input
            type="date"
            value={data.loading_date ?? ""}
            onChange={(e) => update("loading_date", e.target.value || null)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </label>
        <TextField
          label="Miesto nakládky"
          value={data.loading_place}
          onChange={(v) => update("loading_place", v)}
        />
        <TextField
          label="Miesto vykládky"
          value={data.unloading_place}
          onChange={(v) => update("unloading_place", v)}
        />
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Poznámky
        </span>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => update("notes", e.target.value || null)}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Ukladám…" : isSaved ? "Uložené — uložiť znova" : "Uložiť dokument"}
        </button>
        {isSaved && (
          <span className="text-sm text-green-700">Dokument bol uložený.</span>
        )}
      </div>
    </div>
  );
}
