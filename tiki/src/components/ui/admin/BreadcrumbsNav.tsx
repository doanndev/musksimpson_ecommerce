'use client';

import { ROUTES } from '@/lib/routes';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import React from 'react';

const BreadcrumbsNav: React.FC = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter((p) => p);
    const crumbs = paths.map((path, index) => {
      const fullPath = `/${paths.slice(0, index + 1).join('/')}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return { name, path: fullPath };
    });
    return [{ name: 'Dashboard', path: ROUTES.ADMIN_HOME }, ...crumbs];
  };

  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
      {generateBreadcrumbs().map((crumb, index) =>
        index === generateBreadcrumbs().length - 1 ? (
          <Typography key={crumb.path} color='text.primary'>
            {crumb.name}
          </Typography>
        ) : (
          <Link key={crumb.path} underline='hover' color='inherit' href={crumb.path} sx={{ fontWeight: 500 }}>
            {crumb.name}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
