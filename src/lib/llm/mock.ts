/**
 * Mock provider — deterministic, credential-free output so Boardroom always
 * runs locally and demos without any API keys. It infers which board member
 * (or the final synthesis) is being asked for from the prompt text and returns
 * the matching sample, validated/normalised against the caller's schema.
 */

import { AGENT_ROLES, type AgentRole } from "../types";
import { SAMPLE_AGENT_ANALYSES, SAMPLE_SYNTHESIS } from "../sample";
import type {
  GenerateJSONParams,
  GenerateTextParams,
  LLMProvider,
} from "./types";

function detectRole(text: string): AgentRole | null {
  const t = text.toLowerCase();
  if (/(venture|vc\b|investor|fund)/.test(t)) return "vc";
  if (/(cfo|financ|unit econ|burn|margin)/.test(t)) return "cfo";
  if (/(cto|technical|architect|feasib|engineer)/.test(t)) return "cto";
  if (/(customer|buyer|user pain|willingness to pay)/.test(t)) return "customer";
  if (/(competit|rival|incumbent|substitut)/.test(t)) return "competitor";
  return null;
}

function isSynthesis(text: string): boolean {
  const t = text.toLowerCase();
  return /(memo|action plan|recommendation|build this weekend|prove this)/.test(t);
}

export class MockProvider implements LLMProvider {
  readonly name = "mock";
  readonly live = false;

  async generateJSON<T>(params: GenerateJSONParams<T>): Promise<T> {
    const haystack = `${params.system}\n${params.prompt}\n${params.schemaHint}`;
    const tag = params.tag;

    if (tag === "synthesis" || (!tag && isSynthesis(haystack))) {
      return params.schema.parse(SAMPLE_SYNTHESIS) as T;
    }

    const role: AgentRole =
      tag && (AGENT_ROLES as string[]).includes(tag)
        ? (tag as AgentRole)
        : (detectRole(haystack) ?? "vc");
    const sample =
      SAMPLE_AGENT_ANALYSES.find((a) => a.role === role) ??
      SAMPLE_AGENT_ANALYSES[0];

    // schema.parse strips the orchestrator-stamped fields (id/role/raisedBy),
    // returning the raw shape the agent layer expects.
    return params.schema.parse(sample) as T;
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    const last = [...params.messages].reverse().find((m) => m.role === "user");
    return (
      "**[Demo mode — Mock provider]** No model credentials are configured, so " +
      "I'm replaying a canned board response. Set `LLM_PROVIDER=vertex` (or " +
      "`gemini`) with credentials to get live analysis.\n\n" +
      (last
        ? `You asked: “${last.content.slice(0, 200)}”. In demo mode the board ` +
          "recommends shipping the smallest weekend prototype that proves your " +
          "riskiest assumption."
        : "")
    );
  }
}
