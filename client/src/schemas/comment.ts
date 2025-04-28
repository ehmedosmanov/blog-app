import * as z from 'zod';
export const commentSchema = z.object({
  content: z
    .string()
    .min(3, { message: 'Comment must be at least 3 characters' })
    .max(1000, { message: 'Comment must be less than 1000 characters' }),
});
