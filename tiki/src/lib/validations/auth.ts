import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email hoặc tên đăng nhập là bắt buộc')
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || value.length >= 3;
    }, 'Email không hợp lệ hoặc tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// // --- Mới thêm validation cho updateUser ---
// export const updateUserSchema = z.object({
//   username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
//   full_name: z.string().min(1, 'Họ tên là bắt buộc'),
//   phone_number: z
//     .string()
//     .min(9, 'Số điện thoại không hợp lệ')
//     .max(15, 'Số điện thoại không hợp lệ')
//     .regex(/^\+?\d+$/, 'Số điện thoại chỉ được chứa chữ số và dấu +'),
//   day_of_birth: z
//     .string()
//     .min(10, 'Ngày sinh không hợp lệ')
//     .max(10, 'Ngày sinh không hợp lệ')
//     .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD'),
// });

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới'),

  full_name: z.string().min(1, 'Họ tên là bắt buộc').max(100, 'Họ tên không được vượt quá 100 ký tự'),

  phone_number: z
    .string()
    .transform((val) => val.replace(/\s+/g, '').replace(/^0/, '+84')) // 032... → +8432...
    .refine((val) => /^\+84\d{9}$/.test(val), 'Số điện thoại không hợp lệ (VD: +84912345678 hoặc 0912345678)'),
  day_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD')
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      return !isNaN(date.getTime()) && date < now;
    }, 'Ngày sinh phải là ngày trong quá khứ'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
