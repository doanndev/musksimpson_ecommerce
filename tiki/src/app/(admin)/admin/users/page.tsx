'use client';

import { useCurrentUserQuery, useUsersQuery } from '@/api/user/query';
import type { UserResponseData } from '@/api/user/type';
import { RoleEnum } from '@/lib/constants/role';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import UserTable from './components/UserTable';
const UserPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useUsersQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    search,
  });

  useEffect(() => {
    refetch();
  }, []);

  const { data: currentUser } = useCurrentUserQuery();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (!usersData || !currentUser) return <div>Error: Data not found</div>;

  const handleMapUserData = (users: UserResponseData[]) =>
    users.map((user) => ({
      ID: user.uuid,
      Username: user.username,
      Email: user.email,
      'Full Name': user.full_name || '',
      'Phone Number': user.phone_number || '',
      Role: user.roles === RoleEnum.ADMIN ? 'Admin' : user.roles === RoleEnum.USER ? 'User' : 'Seller',
    }));

  return (
    <Box className='pb-6'>
      <Typography variant='h4' className='!mb-3'>
        Quản lí người dùng
      </Typography>
      <UserTable
        users={usersData.items}
        page={page}
        rowsPerPage={rowsPerPage}
        totalItems={usersData.meta.totalItem}
        currentUser={currentUser}
        onMapUserData={handleMapUserData}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default UserPage;
