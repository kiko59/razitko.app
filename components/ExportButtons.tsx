interface ExportButtonsProps {
  documentId: string;
}

export default function ExportButtons({ documentId }: ExportButtonsProps) {
  return (
    <div className="flex gap-3">
      <a
        href={`/api/export/pdf?id=${documentId}`}
        download
        className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
      >
        Stiahnuť PDF
      </a>
      <a
        href={`/api/documents/${documentId}?download=1`}
        download
        className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
      >
        Stiahnuť JSON
      </a>
    </div>
  );
}
