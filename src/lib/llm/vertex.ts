/**
 * Gemini via Vertex AI.
 *
 * Auth uses Application Default Credentials (ADC). Provide ONE of:
 *  - GOOGLE_APPLICATION_CREDENTIALS pointing at a service-account JSON file, or
 *  - a JSON key inline via GOOGLE_SERVICE_ACCOUNT_KEY (written to a temp file), or
 *  - ambient credentials (gcloud auth / Cloud Run service identity).
 *
 * Required: GOOGLE_CLOUD_PROJECT (or GCP_PROJECT) and GOOGLE_CLOUD_LOCATION
 * (defaults to "us-central1").
 */

import { GoogleGenAI } from "@google/genai";
import { GoogleGenAIProvider } from "./google";
import { ProviderUnavailableError } from "./types";

export function createVertexProvider(): GoogleGenAIProvider {
  const project =
    process.env.GOOGLE_CLOUD_PROJECT ??
    process.env.GCP_PROJECT ??
    process.env.GOOGLE_PROJECT_ID;
  const location =
    process.env.GOOGLE_CLOUD_LOCATION ?? process.env.GCP_LOCATION ?? "us-central1";

  if (!project) {
    throw new ProviderUnavailableError(
      "Vertex provider requires GOOGLE_CLOUD_PROJECT to be set.",
    );
  }

  const client = new GoogleGenAI({ vertexai: true, project, location });
  return new GoogleGenAIProvider({ name: "vertex", client });
}
