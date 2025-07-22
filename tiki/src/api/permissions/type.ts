import type { z } from 'zod';
import type { PermissionResponseDataSchema } from './schema';

export type PermissionResponse = z.infer<typeof PermissionResponseDataSchema>;
