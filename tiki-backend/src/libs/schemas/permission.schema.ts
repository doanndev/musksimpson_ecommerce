import { z } from 'zod';

export const PermissionResponseDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PermissionResponseDataType = z.infer<typeof PermissionResponseDataSchema>;
