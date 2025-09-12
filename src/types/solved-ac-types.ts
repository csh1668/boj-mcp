import { z } from "zod";

export const languageSchema = z.enum(["ko", "en", "ja"]).or(z.string());
export type Language = z.infer<typeof languageSchema>;

export const problemTitleTranslatedSchema = z.object({
  language: languageSchema,
  languageDisplayName: z.string(),
  title: z.string(),
  isOriginal: z.boolean()
});
export type ProblemTitleTranslated = z.infer<typeof problemTitleTranslatedSchema>;

export const problemTagNameTranslatedSchema = z.object({
  language: languageSchema,
  name: z.string(),
  short: z.string(),
});
export type ProblemTagNameTranslated = z.infer<typeof problemTagNameTranslatedSchema>;

export const problemTagAliasSchema = z.object({
  alias: z.string(),
});
export type ProblemTagAlias = z.infer<typeof problemTagAliasSchema>;

export const problemTagSchema = z.object({
  key: z.string(),
  isMeta: z.boolean(),
  bojTagId: z.number(),
  problemCount: z.number(),
  displayNames: z.array(problemTagNameTranslatedSchema),
  aliases: z.array(problemTagAliasSchema)
});
export type ProblemTag = z.infer<typeof problemTagSchema>;

export const problemSchema = z.object({
  problemId: z.number(),
  titleKo: z.string(),
  titles: z.array(problemTitleTranslatedSchema),
  isSolvable: z.boolean(),
  isPartial: z.boolean(),
  acceptedUserCount: z.number(),
  level: z.number(),
  votedUserCount: z.number(),
  sprout: z.boolean(),
  givesNoRating: z.boolean(),
  isLevelLocked: z.boolean(),
  averageTries: z.number(),
  official: z.boolean(),
  tags: z.array(problemTagSchema),
  metadata: z.any(),
});
export type Problem = z.infer<typeof problemSchema>;