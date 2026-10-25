import { z } from "zod";
import { AiProviderSchema } from "./providers.js";

export const SkillPricingSchema = z.object({
  /** Amount in micro-units of the asset (e.g. microAlgos) for precision. */
  amountMicro: z.number().int().nonnegative(),
  asset: z.enum(["ALGO", "USDC"]).default("ALGO"),
  /** Algorand address that receives the developer share. */
  developerPayTo: z.string().min(58).max(58).optional(),
  /** Platform fee in basis points (100 = 1%). */
  platformFeeBps: z.number().int().min(0).max(10_000).default(1000),
});

export const SkillManifestSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9-]*$/),
  name: z.string().min(1).max(120),
  version: z.string().min(1),
  description: z.string().max(2000),
  author: z.string().min(1),
  providers: z.array(AiProviderSchema).min(1),
  pricing: SkillPricingSchema,
  /** Relative path or inline body reference for SKILL.md content. */
  bodyPath: z.string().default("SKILL.md"),
  tags: z.array(z.string()).default([]),
  inputs: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        required: z.boolean().default(true),
        placeholder: z.string().optional(),
      }),
    )
    .default([]),
});

export type SkillManifest = z.infer<typeof SkillManifestSchema>;
export type SkillPricing = z.infer<typeof SkillPricingSchema>;

export function parseSkillManifest(data: unknown): SkillManifest {
  return SkillManifestSchema.parse(data);
}

/**
 * Replace `{{inputKey}}` placeholders in skill body with user-provided values.
 * Unknown placeholders are left intact so the model can still see them.
 */
export function renderSkillBody(
  template: string,
  inputs: Record<string, string>,
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(inputs, key)) {
      return inputs[key] ?? "";
    }
    return match;
  });
}
