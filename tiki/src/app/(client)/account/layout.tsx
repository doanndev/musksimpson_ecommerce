import { AccountLayout } from '@/components/layout';
import React from 'react';

interface Props extends React.PropsWithChildren {}

const Layout = ({ children }: Props) => {
  return <AccountLayout>{children}</AccountLayout>;
};

export default Layout;
