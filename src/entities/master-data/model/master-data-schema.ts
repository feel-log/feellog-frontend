import { z } from 'zod';

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const CategoryGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  categories: z.array(CategorySchema),
});

const EmotionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const EmotionGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  emotions: z.array(EmotionSchema),
});

const SituationTagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const MasterDataSchema = z.object({
  categoryGroups: z.array(CategoryGroupSchema),
  emotionGroups: z.array(EmotionGroupSchema),
  situationTags: z.array(SituationTagSchema),
  paymentMethods: z.array(PaymentMethodSchema),
});

export type MasterData = z.infer<typeof MasterDataSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Emotion = z.infer<typeof EmotionSchema>;
export type SituationTag = z.infer<typeof SituationTagSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
