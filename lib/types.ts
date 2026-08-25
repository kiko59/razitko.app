export type DocumentType = "CMR" | "BOL" | "dodaci_list" | "iny";

export interface Party {
  name: string | null;
  address: string | null;
}

export interface TransportDocumentData {
  document_type: DocumentType;
  sender: Party;
  recipient: Party;
  weight_kg: number | null;
  reference_number: string | null;
  loading_date: string | null;
  loading_place: string | null;
  unloading_place: string | null;
  notes: string | null;
}

export interface TransportDocumentRecord {
  id: string;
  created_at: string;
  file_name: string;
  file_path: string;
  mime_type: string;
  data: TransportDocumentData;
}
