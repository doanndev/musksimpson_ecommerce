import { Box } from '@mui/material';
import React from 'react';
import BreadcrumbsNav from './BreadcrumbsNav';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
}

const drawerWidth = 240;
const collapsedWidth = 60;

const MainContent: React.FC<MainContentProps> = ({ children, isSidebarOpen }) => {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: isSidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
        transition: 'margin-left 0.3s',
        backgroundColor: '#f1f5f9',
      }}
    >
      <BreadcrumbsNav />
      {children}
    </Box>
  );
};

export default MainContent;
