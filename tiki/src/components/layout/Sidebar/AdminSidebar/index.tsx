'use client';

import { useAuthAdmin } from '@/hooks/useAuthAdmin';
import { useUserLogin } from '@/hooks/useUserLogin';
import { RoleEnum } from '@/lib/constants/role';
import { ChevronLeft, ChevronRight, Logout as LogoutIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Drawer, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import SidebarMenu from './SidebarMenu';

const drawerWidth = 245;
const collapsedWidth = 60;

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, isLoggedIn, refreshToken } = useUserLogin();
  const { logout } = useAuthAdmin();
  const router = useRouter();

  const handleLogout = async () => {
    // try {
    //   await fetch('/api/auth/logout', { method: 'POST' });
    //   router.push(ROUTES.ADMIN_LOGIN);
    //   toast.success('Logged out successfully');
    // } catch (error) {
    //   toast.error('Logout failed');
    // }
  };

  return (
    <Drawer
      variant='permanent'
      className='fixed z-9'
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isOpen ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          borderRight: '1px solid #334155',
          transition: 'width 0.3s, border-radius 0.3s',
        },
      }}
    >
      {/* Logo */}
      <Box className='flex items-center justify-between border-gray-700 border-b p-4'>
        {isOpen && <Image src='/images/logo.svg' alt='Logo' width={120} height={40} className='object-contain' />}
        <IconButton onClick={onToggle} sx={{ color: '#ffffff' }}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Menu */}
      <SidebarMenu isOpen={isOpen} userRole={(user?.roles as RoleEnum) ?? RoleEnum.USER} />

      {/* Logout Button */}
      <Box className='mt-auto border-gray-700 border-t p-4'>
        {isLoggedIn && user && (
          <Button
            onClick={() => logout({ refreshToken })}
            sx={{
              color: '#ffffff',
              width: '100%',
              justifyContent: isOpen ? 'flex-start' : 'center',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <Avatar src={user.avatar || ''} sx={{ width: 32, height: 32, mr: isOpen ? 2 : 0 }} />
            {isOpen && (
              <>
                <Typography>{user.username}</Typography>
                <LogoutIcon sx={{ ml: 'auto' }} />
              </>
            )}
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export { AdminSidebar };
