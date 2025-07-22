import { MESSAGES } from '@/lib/constants/messages';
import { z } from 'zod';

const AddressCreateInputBaseSchema = z.object({
  user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
  full_name: z.string().min(1, { message: MESSAGES.FULL_NAME_REQUIRED }),
  phone_number: z.string().min(1, { message: MESSAGES.PHONE_NUMBER_REQUIRED }),
  address: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
  province_id: z.number().int().positive().optional(),
  province_name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }).optional(),
  district_id: z.number().int().positive().optional(),
  district_name: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }).optional(),
  ward_code: z.string().max(50).optional(),
  ward_name: z.string().max(50).optional(),
  type_address: z.enum(['HOME', 'WORK', 'OTHER']).optional().default('HOME'),
  is_default: z.boolean().optional().default(false),
  region_id: z.number().int().positive().optional(),
});

export const AddressCreateInputSchema = AddressCreateInputBaseSchema.refine(
  (data) => (data.province_id ?? 0) > 0 || (data.province_name?.length ?? 0) > 0,
  { message: MESSAGES.ADDRESS_REQUIRED, path: ['province_id'] }
)
  .refine((data) => (data.district_id ?? 0) > 0 || (data.district_name?.length ?? 0) > 0, {
    message: MESSAGES.ADDRESS_REQUIRED,
    path: ['district_id'],
  })
  .refine((data) => (data.ward_code?.length ?? 0) > 0 || (data.ward_name?.length ?? 0) > 0, {
    message: MESSAGES.ADDRESS_REQUIRED,
    path: ['ward_code'],
  });

export const AddressUpdateInputSchema = AddressCreateInputBaseSchema.partial().extend({
  id: z.number().int().positive().optional(),
});

export const AddressResponseSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  full_name: z.string(),
  phone_number: z.string(),
  address: z.string(),
  ward_code: z.string().nullable(),
  ward_name: z.string().nullable(),
  district_id: z.number().nullable(),
  district_name: z.string().nullable(),
  province_id: z.number().nullable(),
  province_name: z.string().nullable(),
  type_address: z.enum(['HOME', 'WORK', 'OTHER']).nullable(),
  is_default: z.boolean(),
  region_id: z.number().nullable(),
});

export const AddressIdParamSchema = z.object({
  id: z.coerce.number().int().positive({ message: MESSAGES.INVALID_ID }),
});
