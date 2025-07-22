'use client';

import { useCurrentUserQuery } from '@/api/user/query';
import type { UserResponseData } from '@/api/user/type';
import { HStack } from '@/components/utils/h-stack';
import type { ContactInfoType, PersonalInfoType } from '@/lib/validations/account';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import ContactInfo from './components/ContactInfo';
import PersonalInfo from './components/PersonalInfo';
import SecurityInfo from './components/SecurityInfo';

const parseDateOfBirth = (dateString: string | null): { birthDay: number; birthMonth: number; birthYear: number } => {
  if (!dateString || !dayjs(dateString).isValid()) {
    return { birthDay: 1, birthMonth: 1, birthYear: dayjs().year() - 13 };
  }
  const date = dayjs(dateString);
  return {
    birthDay: date.date(),
    birthMonth: date.month() + 1,
    birthYear: date.year(),
  };
};

const mapUserToFormData = (user: UserResponseData) => {
  const { birthDay, birthMonth, birthYear } = parseDateOfBirth(user.day_of_birth);
  const personalData: PersonalInfoType = {
    fullName: user.full_name || '',
    nickname: user.username || '',
    birthDay,
    birthMonth,
    birthYear,
    gender: user.gender === true ? 'Nam' : user.gender === false ? 'Nữ' : 'Khác',
    // nationality: user.addresses?.[0]?.province_name || 'Việt Nam',
    avatar: user.avatar || null,
  };
  const contactData: ContactInfoType = {
    phone: user.phone_number || '',
    email: user.email || '',
  };
  return { personalData, contactData };
};

export default function AccountInfoPage() {
  const { data: currentUser, isLoading, error } = useCurrentUserQuery();

  if (isLoading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error || !currentUser) {
    return <Typography>Lỗi khi tải thông tin người dùng</Typography>;
  }

  const { personalData, contactData } = mapUserToFormData(currentUser);

  return (
    <div className='!pb-6 space-y-6'>
      <Typography variant='h5' fontWeight={500} className='!mb-6 !font-semibold text-gray-800'>
        Thông tin tài khoản
      </Typography>
      <HStack align='start' noWrap>
        <PersonalInfo initialData={personalData} />
        <div className='min-w-[400px]'>
          <ContactInfo initialData={contactData} />
          <SecurityInfo />
        </div>
      </HStack>
    </div>
  );
}
