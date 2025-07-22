import { ClientLayout } from '@/components/layout';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default Layout;
