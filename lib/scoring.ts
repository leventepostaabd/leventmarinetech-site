import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { LeadWithRefs } from '@/lib/crm';

/**
 * Lead scoring "brain" (Wave 6 Phase 2).
 *
 * Manual-trigger only (C1): an admin clicks "Score with AI" on a lead and
 * Claude returns a 0–100 priority score, a factor breakdown, a recommended
 * next action, and a bilingual outreach draft. The draft is **never sent**
 * (D3) — the operator copies it into their own WhatsApp / email.
 *
 * Gated behind ANTHROPIC_API_KEY: if the key is absent the caller gets a
 * clear error and the lead is left untouched. Nothing here runs at build or
 * request time unless explicitly invoked.
 */

const MODEL = 'claude-opus-4-7';

export const ScoringResult = z.object({
  priority_score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('0–100. Higher = more urgent / higher-value / better fit for Levent Marine.'),
  rationale: z
    .string()
    .describe('One or two sentences explaining the score, in English.'),
  factors: z
    .array(
      z.object({
        label: z.string().describe('Short factor name, e.g. "Urgency", "Port fit", "Vessel value".'),
        weight: z.enum(['high', 'medium', 'low']),
        note: z.string().describe('Why this factor pushed the score up or down.')
      })
    )
    .describe('The 2–5 factors that most drove the score.'),
  recommended_action: z
    .string()
    .describe('The single most useful next step for the operator (in English).'),
  draft_en: z
    .string()
    .describe('Ready-to-send outreach message in English. No prices. References vessel/port/system where known.'),
  draft_tr: z
    .string()
    .describe('Turkish translation of the same outreach message.')
});

export type ScoringResult = z.infer<typeof ScoringResult>;

/**
 * JSON schema handed to the Messages API `output_config.format`. Kept in sync
 * with the Zod schema above by hand — we validate the response with Zod, so a
 * drift would surface as a parse error rather than bad data.
 */
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    priority_score: { type: 'integer', minimum: 0, maximum: 100 },
    rationale: { type: 'string' },
    factors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          weight: { type: 'string', enum: ['high', 'medium', 'low'] },
          note: { type: 'string' }
        },
        required: ['label', 'weight', 'note'],
        additionalProperties: false
      }
    },
    recommended_action: { type: 'string' },
    draft_en: { type: 'string' },
    draft_tr: { type: 'string' }
  },
  required: ['priority_score', 'rationale', 'factors', 'recommended_action', 'draft_en', 'draft_tr'],
  additionalProperties: false
} as const;

const SYSTEM_PROMPT = `You are the lead-prioritisation assistant for Levent Marine Electro Technical Services LLC — a Florida-based marine electrical service & parts supply company serving commercial vessels (bulkers, tankers, cruise) at all US ports, 24/7, worldwide coverage.

What the company does:
- Emergency & planned marine electrical service (generators, switchboards, automation/PLC, navigation, GMDSS, BWTS, motors, etc.).
- Spare-parts supply (marine electric, general electric, general marine) sourced via business accounts.
- Customers are technical superintendents, class surveyors, brokers, P&I, shipyards.

How to score (0–100):
- Urgency is the strongest signal: AOG / "now" / emergency → very high; within 24h / urgent → high; planned → moderate.
- Port fit: a vessel at or heading to a US port is a strong positive (that is the company's core operating area).
- Specificity: a concrete system, brand, part number, or IMO makes the lead more actionable.
- Vessel/company quality: a real named vessel + IMO + reputable operator raises confidence.
- Penalise: vague enquiries with no vessel, no port, and no contact channel.

Outreach drafts:
- Write a concise, professional first-contact message the operator can send by WhatsApp or email.
- Reference the vessel name, US port window, and the specific system/part when known.
- NEVER mention prices — the company quotes privately ("we'll get you a quote").
- Do NOT invent facts (vessel details, ports, certifications) that are not in the lead data.
- Keep it to a few short sentences. Sign off as "Levent Marine".
- draft_tr must be a faithful Turkish translation of draft_en.`;

function buildLeadDigest(lead: LeadWithRefs): string {
  const ctx = (lead.context ?? {}) as Record<string, unknown>;
  const lines: string[] = [];

  lines.push(`Track: ${lead.track}`);
  lines.push(`Source: ${lead.source}`);
  lines.push(`Current stage: ${lead.stage}`);

  if (lead.company) {
    lines.push(`Company: ${lead.company.name}${lead.company.country ? ` (${lead.company.country})` : ''}`);
  }
  if (lead.vessel) {
    const v = lead.vessel;
    const bits = [v.name];
    if (v.imo_no) bits.push(`IMO ${v.imo_no}`);
    if (v.vessel_type) bits.push(v.vessel_type);
    if (v.flag) bits.push(`flag ${v.flag}`);
    lines.push(`Vessel: ${bits.join(' · ')}`);
  }

  const ctxOrder = [
    'urgency', 'port', 'system', 'brand', 'part_number',
    'description', 'contact_name', 'contact_email', 'contact_phone'
  ];
  for (const key of ctxOrder) {
    const val = ctx[key];
    if (val !== undefined && val !== null && String(val).trim()) {
      lines.push(`${key.replace(/_/g, ' ')}: ${String(val)}`);
    }
  }
  // Any remaining context keys not covered above.
  for (const [key, val] of Object.entries(ctx)) {
    if (ctxOrder.includes(key)) continue;
    if (val !== undefined && val !== null && String(val).trim()) {
      lines.push(`${key.replace(/_/g, ' ')}: ${String(val)}`);
    }
  }

  return lines.join('\n');
}

export class ScoringUnavailableError extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY is not configured — AI scoring is disabled.');
    this.name = 'ScoringUnavailableError';
  }
}

export function isScoringConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Score a lead and generate a bilingual outreach draft with Claude.
 * Throws ScoringUnavailableError when the API key is missing.
 */
export async function scoreLead(lead: LeadWithRefs): Promise<ScoringResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new ScoringUnavailableError();

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: OUTPUT_SCHEMA }
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Score this lead and draft outreach.\n\n${buildLeadDigest(lead)}`
      }
    ]
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  if (!text) throw new Error('Scoring returned an empty response.');

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Scoring returned non-JSON output.');
  }
  return ScoringResult.parse(raw);
}
