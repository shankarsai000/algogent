import type { AiProvider, SkillManifest } from "@algogent/shared";

export type SkillFilter = {
  query?: string;
  provider?: string;
  tag?: string;
};

/**
 * Filter a skill catalog by free-text query, provider, and/or tag.
 * Pure function — safe for unit tests and UI.
 */
export function filterSkills(
  skills: SkillManifest[],
  filter: SkillFilter,
): SkillManifest[] {
  const q = filter.query?.trim().toLowerCase();
  const provider = filter.provider?.trim().toLowerCase();
  const tag = filter.tag?.trim().toLowerCase();

  return skills.filter((skill) => {
    if (provider && provider !== "all") {
      if (!skill.providers.map((p) => p.toLowerCase()).includes(provider as AiProvider)) {
        // providers are typed; also allow string compare
        if (!skill.providers.some((p) => p.toLowerCase() === provider)) {
          return false;
        }
      }
    }
    if (tag && !skill.tags.some((t) => t.toLowerCase() === tag)) {
      return false;
    }
    if (q) {
      const haystack = [
        skill.id,
        skill.name,
        skill.description,
        skill.author,
        ...skill.tags,
        ...skill.providers,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
