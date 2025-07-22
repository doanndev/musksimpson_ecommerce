import { z } from 'zod';

export const addressSchema = z
  .object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    phoneNumber: z
      .string()
      .regex(/^(\+84|0)\s?(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])(\s?\d){7}$/, 'Số điện thoại không hợp lệ'),
    province_id: z.number(),
    district_id: z.number(),
    ward_code: z.string(),
    province_name: z.string(),
    district_name: z.string(),
    ward_name: z.string(),
    address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
    region_id: z.number(),
    typeAddress: z.enum(['Nhà riêng', 'Công ty']),
    paymentMethod: z.enum(['cash-on-delivery', 'paypal-money']),
    is_default: z.boolean(),
  })
  .refine((data) => data.province_id > 0 || data.province_name.length > 0, {
    message: 'Vui lòng chọn tỉnh/thành phố',
    path: ['province_id'],
  })
  .refine((data) => data.district_id > 0 || data.district_name.length > 0, {
    message: 'Vui lòng chọn quận/huyện',
    path: ['district_id'],
  })
  .refine((data) => data.ward_code.length > 0 || data.ward_name.length > 0, {
    message: 'Vui lòng chọn phường/xã',
    path: ['ward_code'],
  });

export type AddressFormData = z.infer<typeof addressSchema>;
