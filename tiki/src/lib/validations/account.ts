import dayjs from 'dayjs';
import { z } from 'zod';

export const PersonalInfoSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Họ và tên là bắt buộc' }),
    nickname: z.string().optional(),
    birthDay: z.coerce
      .number()
      .int()
      .min(1, { message: 'Ngày phải từ 1 đến 31' })
      .max(31, { message: 'Ngày phải từ 1 đến 31' }),
    birthMonth: z.coerce
      .number()
      .int()
      .min(1, { message: 'Tháng phải từ 1 đến 12' })
      .max(12, { message: 'Tháng phải từ 1 đến 12' }),
    birthYear: z.coerce
      .number()
      .int()
      .min(1900, { message: 'Năm phải từ 1900 trở đi' })
      .max(dayjs().year() - 13, { message: 'Bạn phải ít nhất 13 tuổi' }),
    gender: z.enum(['Nam', 'Nữ', 'Khác'], { message: 'Giới tính là bắt buộc' }),
    // nationality: z.string().min(1, { message: 'Quốc tịch là bắt buộc' }),
    avatar: z.string().nullable(),
  })
  .refine(
    (data) => {
      const date = dayjs()
        .set('year', data.birthYear)
        .set('month', data.birthMonth - 1)
        .set('date', data.birthDay);
      return date.isValid();
    },
    {
      message: 'Ngày sinh không hợp lệ',
      path: ['birthDay'],
    }
  );

export const ContactInfoSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
    .optional(),
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ' }),
});

export type PersonalInfoType = z.infer<typeof PersonalInfoSchema>;
export type ContactInfoType = z.infer<typeof ContactInfoSchema>;
