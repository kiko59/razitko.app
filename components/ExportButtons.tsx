"use client";

import { useTranslations } from "next-intl";

interface ExportButtonsProps {
  documentId: string;
}

export default function ExportButtons({ documentId }: ExportButtonsProps) {
  const t = useTranslations("export");

  return (
    <div className="flex gap-3">
      <a
        href={`/api/export/pdf?id=${documentId}`}
        download
        className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
      >
        {t("pdf")}
      </a>
      <a
        href={`/api/documents/${documentId}?download=1`}
        download
        className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
      >
        {t("json")}
      </a>
    </div>
  );
}
