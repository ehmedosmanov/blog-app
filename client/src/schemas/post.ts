import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/posts';
import * as z from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  content: z
    .string()
    .min(20, { message: 'Content must be at least 20 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  file: z
    .any()
    .optional()
    .refine((files) => {
      if (typeof window !== 'undefined' && files) {
        const fileList = files instanceof FileList ? files : files;

        if (fileList.length > 0) {
          const file = fileList[0];
          return file.size <= MAX_FILE_SIZE;
        }
      }
      return true;
    }, 'Image must be less than 5MB')
    .refine((files) => {
      if (typeof window !== 'undefined' && files) {
        const fileList = files instanceof FileList ? files : files;

        if (fileList.length > 0) {
          const file = fileList[0];
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }
      }
      return true;
    }, 'Only .jpg, .jpeg, .png, and .webp formats are supported'),
});

export type PostFormValues = z.infer<typeof postSchema>;
