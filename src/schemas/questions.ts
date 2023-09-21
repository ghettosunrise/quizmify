import { z } from 'zod';

export const getQuestionsSchemas = z.object({
  topic: z.string(),
  type: z.enum(['mcq', 'open_ended']),
  amount: z.number().int().positive().min(1).max(10),
});
