import { z } from "zod";

export const TransportDocumentSchema = z.object({
  document_type: z
    .enum(["CMR", "BOL", "dodaci_list", "iny"])
    .describe("Typ prepravného dokumentu"),
  sender: z.object({
    name: z.string().nullable().describe("Meno / názov odosielateľa"),
    address: z.string().nullable().describe("Adresa odosielateľa"),
  }),
  recipient: z.object({
    name: z.string().nullable().describe("Meno / názov príjemcu"),
    address: z.string().nullable().describe("Adresa príjemcu"),
  }),
  weight_kg: z.number().nullable().describe("Hrubá váha zásielky v kilogramoch"),
  reference_number: z
    .string()
    .nullable()
    .describe("Referenčné / evidenčné číslo dokumentu"),
  loading_date: z
    .string()
    .nullable()
    .describe("Dátum nakládky vo formáte YYYY-MM-DD, ak je uvedený"),
  loading_place: z.string().nullable().describe("Miesto nakládky"),
  unloading_place: z.string().nullable().describe("Miesto vykládky"),
  notes: z
    .string()
    .nullable()
    .describe("Akékoľvek ďalšie poznámky alebo neisté/nečitateľné polia"),
});

export type TransportDocumentData = z.infer<typeof TransportDocumentSchema>;

export const EXTRACTION_SYSTEM_PROMPT = `Si asistent na extrakciu dát z prepravných dokumentov (CMR, Bill of Lading, dodacie listy).
Dostaneš obrázok alebo PDF dokumentu. Tvojou úlohou je presne prečítať dokument a vyplniť požadované polia.

Pravidlá:
- Ak pole v dokumente nie je prítomné alebo je nečitateľné, vráť null — nikdy si nevymýšľaj hodnoty.
- Váhu prepočítaj vždy na kilogramy (napr. "1,2 t" -> 1200).
- Dátum nakládky vráť vo formáte YYYY-MM-DD, ak vieš rok/mesiac/deň spoľahlivo určiť; inak null.
- Do poľa notes napíš stručne, ktoré polia si si nebol istý alebo si ich musel odvodiť.`;
