interface ExportButtonsProps {
  documentId: string;
}

export default function ExportButtons({ documentId }: ExportButtonsProps) {
  return (
    <div className="flex gap-3">
      <a
        href={`/api/export/pdf?id=${documentId}`}
        download
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Stiahnuť PDF
      </a>
      <a
        href={`/api/documents/${documentId}?download=1`}
        download
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Stiahnuť JSON
      </a>
    </div>
  );
}
