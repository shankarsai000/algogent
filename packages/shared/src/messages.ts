import { z } from "zod";
import { AiProviderSchema } from "./providers.js";

export const SkillRunRequestSchema = z.object({
  type: z.literal("RUN_SKILL"),
  skillId: z.string(),
  provider: AiProviderSchema,
  renderedBody: z.string().min(1),
  runId: z.string().min(8),
});

export const SkillResultSchema = z.object({
  type: z.literal("SKILL_RESULT"),
  runId: z.string().min(8),
  status: z.enum(["success", "failed", "cancelled"]),
  summary: z.string().optional(),
  errorCode: z.string().optional(),
});

export const GetActiveProviderSchema = z.object({
  type: z.literal("GET_ACTIVE_PROVIDER"),
});

export const ExtensionMessageSchema = z.discriminatedUnion("type", [
  SkillRunRequestSchema,
  SkillResultSchema,
  GetActiveProviderSchema,
]);

export type SkillRunRequest = z.infer<typeof SkillRunRequestSchema>;
export type SkillResult = z.infer<typeof SkillResultSchema>;
export type ExtensionMessage = z.infer<typeof ExtensionMessageSchema>;
