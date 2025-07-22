'use client';

import { Icons } from '@/assets/icons';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Trang chủ', href: '/' }];

  // Map routes to breadcrumb labels
  const pathSegments = pathname.split('/').filter((segment) => segment);
  pathSegments.forEach((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    if (segment === 'account') label = 'Tài khoản';
    if (segment === 'info') label = 'Thông tin tài khoản';
    if (segment === 'orders') label = 'Quản lý đơn hàng';
    breadcrumbItems.push({ label, href });
  });

  return (
    <Breadcrumbs aria-label='breadcrumb' className='mb-4'>
      {breadcrumbItems.map((item, index) =>
        index === 0 ? (
          <Link key={index} href={item.href} className='flex items-center text-blue-600 hover:underline'>
            <Icons.home className='mr-1' /> {item.label}
          </Link>
        ) : index === breadcrumbItems.length - 1 ? (
          <Typography key={index} color='text.primary'>
            {item.label}
          </Typography>
        ) : (
          <Link key={index} href={item.href} className='text-blue-600 hover:underline'>
            {item.label}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
}
