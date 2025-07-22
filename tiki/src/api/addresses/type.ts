import type { z } from 'zod';
import type {
  AddressCreateInputSchema,
  AddressIdParamSchema,
  AddressResponseSchema,
  AddressUpdateInputSchema,
} from './schema';

export type AddressCreateInput = z.infer<typeof AddressCreateInputSchema>;
export type AddressUpdateInput = z.infer<typeof AddressUpdateInputSchema>;
export type AddressResponse = z.infer<typeof AddressResponseSchema>;
export type AddressIdParam = z.infer<typeof AddressIdParamSchema>;
