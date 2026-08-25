import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  EXTRACTION_SYSTEM_PROMPT,
  TransportDocumentSchema,
  type TransportDocumentData,
} from "@/lib/extraction-schema";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

interface ExtractParams {
  base64Data: string;
  mimeType: string;
}

export async function extractTransportDocument({
  base64Data,
  mimeType,
}: ExtractParams): Promise<TransportDocumentData> {
  const isPdf = mimeType === "application/pdf";

  const documentBlock = isPdf
    ? {
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: base64Data,
        },
      }
    : {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mimeType as SupportedImageType,
          data: base64Data,
        },
      };

  const response = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          documentBlock,
          {
            type: "text",
            text: "Extrahuj údaje z tohto prepravného dokumentu.",
          },
        ],
      },
    ],
    output_config: {
      format: zodOutputFormat(TransportDocumentSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("Claude nevrátil platné štruktúrované dáta.");
  }

  return response.parsed_output;
}
