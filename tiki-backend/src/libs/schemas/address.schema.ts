import { z } from 'zod';
import { MESSAGES } from '../constants/messages.constant';

export const AddressCreateInputSchema = z.object({
    user_id: z.string().uuid({ message: MESSAGES.INVALID_UUID }),
    full_name: z.string().min(1, { message: MESSAGES.FULL_NAME_REQUIRED }),
    phone_number: z.string().min(1, { message: MESSAGES.PHONE_NUMBER_REQUIRED }),
    address: z.string().min(1, { message: MESSAGES.ADDRESS_REQUIRED }),
    province_id: z.number().int().positive().optional(),
    province_name: z.string().optional(),
    district_id: z.number().int().positive().optional(),
    district_name: z.string().optional(),
    ward_code: z.string().max(50).optional(),
    ward_name: z.string().optional(),
    region_id: z.number(),
    type_address: z.enum(['HOME', 'WORK', 'OTHER']).optional().default('HOME'),
    is_default: z.boolean().optional().default(false),
});


export const AddressUpdateInputSchema = AddressCreateInputSchema.partial().extend({
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
    region_id: z.number().nullable(),
    type_address: z.enum(['HOME', 'WORK', 'OTHER']).nullable(),
    is_default: z.boolean(),
});

export type AddressCreateInputType = z.infer<typeof AddressCreateInputSchema>;
export type AddressUpdateInputType = z.infer<typeof AddressUpdateInputSchema>;
export type AddressResponseType = z.infer<typeof AddressResponseSchema>;
