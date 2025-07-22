'use client';

import type { UserResponseData } from '@/api/user/type';
import ExcelButton from '@/components/ui/admin/ExcelButton';
import { formatPhone } from '@/components/utils/phone';
import { RoleEnum } from '@/lib/constants/role';
import {
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  CreateOutlined as CreateOutlinedIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useServices from '../../hooks/useServices';
import ModalChangeRole from '../ModalChangeRole';
import ModalRemove from '../ModalRemove';

interface UserTableProps {
  users: UserResponseData[];
  page: number;
  rowsPerPage: number;
  totalItems: number;
  currentUser: UserResponseData | null;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMapUserData: (users: UserResponseData[]) => any[];
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  page,
  rowsPerPage,
  totalItems,
  currentUser,
  onPageChange,
  onRowsPerPageChange,
  onMapUserData,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof UserResponseData>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string; roleId: RoleEnum } | null>(null);

  const { updateUserMutation, deleteUserMutation, hideUserMutation } = useServices();
  const router = useRouter();

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(users.map((user) => user.uuid));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (uuid: string) => {
    setSelectedItems((prev) => (prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]));
  };

  const handleSort = (column: keyof UserResponseData) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChangeRole = (event: SelectChangeEvent<RoleEnum>, userId: string) => {
    const roleId = event.target.value as RoleEnum;
    setPendingRoleChange({ userId, roleId });
    setOpenRoleModal(true);
  };

  const confirmRoleChange = () => {
    if (pendingRoleChange && currentUser?.roles === RoleEnum.ADMIN) {
      updateUserMutation({ userId: pendingRoleChange.userId, roles: pendingRoleChange.roleId });
    }
    setOpenRoleModal(false);
    setPendingRoleChange(null);
  };

  const handleOpenRemoveModal = () => {
    setOpenRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveModal(false);
  };

  const handleRemoveUser = () => {
    if (currentUser?.roles === RoleEnum.SELLER) {
      selectedItems.forEach((uuid) => hideUserMutation({ userId: uuid }));
    } else if (currentUser?.roles === RoleEnum.ADMIN) {
      selectedItems.forEach((uuid) => deleteUserMutation({ userId: uuid }));
    }
    setSelectedItems([]);
    setOpenRemoveModal(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : 1;
    }
    return aValue > bValue ? -1 : 1;
  });

  return (
    <div className='rounded-2xl bg-white p-6'>
      {/* Search Input */}
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <TextField
          placeholder='Search by name or email'
          value={search}
          onChange={handleSearchChange}
          size='small'
          InputProps={{
            startAdornment: <SearchIcon color='action' sx={{ mr: 1 }} />,
          }}
          sx={{ width: '350px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          variant='outlined'
        />

        {currentUser?.roles === RoleEnum.ADMIN && (
          <ExcelButton
            mode='export'
            data={users}
            mapDataForExport={onMapUserData}
            fileName='users'
            sheetName='Orders'
            buttonText='Export Orders'
          />
        )}
      </Stack>

      <Box sx={{ minWidth: 800 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.045)' }}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={selectedItems.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {selectedItems.length > 0 ? (
                  <>
                    <TableCell style={{ padding: '10px 12px' }}>
                      <Stack gap={1} direction='row' alignItems='center'>
                        <Typography mr={1}>Đã chọn {selectedItems.length}</Typography>
                        <Typography>|</Typography>
                        <IconButton color='inherit' onClick={handleOpenRemoveModal}>
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ padding: 0 }} />
                    <TableCell style={{ padding: 0 }} />
                    <TableCell style={{ padding: 0 }} />
                    <TableCell style={{ padding: 0 }} />
                    <TableCell style={{ padding: '10px 16px', textAlign: 'center' }} />
                  </>
                ) : (
                  <>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'username'}
                        direction={sortBy === 'username' ? sortOrder : 'asc'}
                        onClick={() => handleSort('username')}
                      >
                        Tên
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Điện thoại</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'roles'}
                        direction={sortBy === 'roles' ? sortOrder : 'asc'}
                        onClick={() => handleSort('roles')}
                      >
                        Vai trò
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'updated_at'}
                        direction={sortBy === 'updated_at' ? sortOrder : 'asc'}
                        onClick={() => handleSort('updated_at')}
                      >
                        Thời gian cập nhập
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Chức năng</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.uuid} hover selected={selectedItems.includes(user.uuid)}>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.includes(user.uuid)}
                      onChange={() => handleSelectItem(user.uuid)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack alignItems='center' direction='row' spacing={2}>
                      <Avatar src={user.avatar || ''}>{user.username[0]}</Avatar>
                      <Stack>
                        <Typography variant='subtitle2'>{user.full_name || user.username}</Typography>
                        <Typography variant='body2' sx={{ color: '#777' }}>
                          {user.email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.addresses?.[0]?.address || '-'}</TableCell>
                  <TableCell>{user.phone_number ? formatPhone(user.phone_number) : '-'}</TableCell>
                  <TableCell>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        value={user.roles}
                        onChange={(e) => handleChangeRole(e as SelectChangeEvent<RoleEnum>, user.uuid)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ borderRadius: 24 }}
                        disabled={currentUser?.roles !== RoleEnum.ADMIN}
                      >
                        <MenuItem value={RoleEnum.ADMIN}>Quản trị viên</MenuItem>
                        <MenuItem value={RoleEnum.USER}>Khách hàng</MenuItem>
                        <MenuItem value={RoleEnum.SELLER}>Người bán</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell className='!flex !h-[110px]' sx={{ textAlign: 'center' }}>
                    <IconButton
                      color='inherit'
                      onClick={() => router.push(`/admin/users/edit/${user.uuid}`)}
                      disabled={currentUser?.roles !== RoleEnum.ADMIN}
                    >
                      <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={() => router.push(`/users/${user.uuid}`)}>
                      <ArrowForwardRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={totalItems}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </Box>

      <ModalRemove
        open={openRemoveModal}
        selectedItems={selectedItems}
        handleClose={handleCloseRemoveModal}
        handleRemove={handleRemoveUser}
      />
      <ModalChangeRole
        open={openRoleModal}
        handleClose={() => setOpenRoleModal(false)}
        handleConfirm={confirmRoleChange}
        roleId={pendingRoleChange?.roleId}
      />
    </div>
  );
};

export default UserTable;
