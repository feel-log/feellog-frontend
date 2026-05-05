import { z } from 'zod';

const EmotionOptionSchema = z.object({
  emotionId: z.number(),
  name: z.string(),
});

const SituationTagOptionSchema = z.object({
  situationTagId: z.number(),
  name: z.string(),
});

const ChoiceOptionSchema = z.object({
  optionId: z.number(),
  optionText: z.string(),
});

export const ReviewOptionsSchema = z.object({
  emotions: z.array(EmotionOptionSchema),
  situationTags: z.array(SituationTagOptionSchema),
  satisfactionOptions: z.array(ChoiceOptionSchema),
  nextActionOptions: z.array(ChoiceOptionSchema),
});

const ReviewTitleSchema = z.object({
  prefixText: z.string(),
  highlightText: z.string(),
  suffixText: z.string(),
});

const ReviewOptionSummarySchema = z.object({
  situationTagName: z.string(),
  satisfactionScore: z.number(),
  nextActionOptionText: z.string(),
});

const ReviewResultSchema = z.object({
  feedbackTitle: z.string(),
  feedbackText: z.string(),
  guideTitle: z.string(),
  guideItems: z.array(z.string()),
});

export const ReviewResponseSchema = z.object({
  reviewId: z.number(),
  reviewDate: z.string(),
  title: ReviewTitleSchema,
  options: ReviewOptionSummarySchema,
  result: ReviewResultSchema,
});

export type ReviewOptions = z.infer<typeof ReviewOptionsSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type EmotionOption = z.infer<typeof EmotionOptionSchema>;
export type SituationTagOption = z.infer<typeof SituationTagOptionSchema>;
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

export interface ReviewUpsertRequest {
  emotionId: number;
  situationTagId: number;
  satisfactionOptionId: number;
  nextActionOptionId: number;
}
