"use client";

import { useTranslations } from "next-intl";
import type { TransportDocumentData, DocumentType } from "@/lib/types";

interface ExtractedDataFormProps {
  data: TransportDocumentData;
  onChange: (data: TransportDocumentData) => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

const FIELD_CLASS =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

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
      <span className="mb-1 block font-medium text-foreground">{label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        className={FIELD_CLASS}
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
  const t = useTranslations("form");

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: "CMR", label: t("docTypeCMR") },
    { value: "BOL", label: t("docTypeBOL") },
    { value: "dodaci_list", label: t("docTypeDodaciList") },
    { value: "iny", label: t("docTypeIny") },
  ];

  function update<K extends keyof TransportDocumentData>(
    key: K,
    value: TransportDocumentData[K],
  ) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">
            {t("documentType")}
          </span>
          <select
            value={data.document_type}
            onChange={(e) =>
              update("document_type", e.target.value as DocumentType)
            }
            className={FIELD_CLASS}
          >
            {documentTypes.map((docType) => (
              <option key={docType.value} value={docType.value}>
                {docType.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-md bg-secondary p-4">
          <h3 className="text-sm font-semibold text-foreground">{t("sender")}</h3>
          <TextField
            label={t("nameLabel")}
            value={data.sender.name}
            onChange={(v) => update("sender", { ...data.sender, name: v })}
          />
          <TextField
            label={t("address")}
            value={data.sender.address}
            onChange={(v) => update("sender", { ...data.sender, address: v })}
          />
        </div>

        <div className="space-y-3 rounded-md bg-secondary p-4">
          <h3 className="text-sm font-semibold text-foreground">{t("recipient")}</h3>
          <TextField
            label={t("nameLabel")}
            value={data.recipient.name}
            onChange={(v) =>
              update("recipient", { ...data.recipient, name: v })
            }
          />
          <TextField
            label={t("address")}
            value={data.recipient.address}
            onChange={(v) =>
              update("recipient", { ...data.recipient, address: v })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">
            {t("weight")}
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
            className={FIELD_CLASS}
          />
        </label>
        <TextField
          label={t("referenceNumber")}
          value={data.reference_number}
          onChange={(v) => update("reference_number", v)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">
            {t("loadingDate")}
          </span>
          <input
            type="date"
            value={data.loading_date ?? ""}
            onChange={(e) => update("loading_date", e.target.value || null)}
            className={FIELD_CLASS}
          />
        </label>
        <TextField
          label={t("loadingPlace")}
          value={data.loading_place}
          onChange={(v) => update("loading_place", v)}
        />
        <TextField
          label={t("unloadingPlace")}
          value={data.unloading_place}
          onChange={(v) => update("unloading_place", v)}
        />
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-foreground">
          {t("notes")}
        </span>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => update("notes", e.target.value || null)}
          rows={3}
          className={FIELD_CLASS}
        />
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("saving") : isSaved ? t("saveAgain") : t("save")}
        </button>
        {isSaved && (
          <span className="text-sm text-green-500">{t("saved")}</span>
        )}
      </div>
    </div>
  );
}
