'use client';

import { RoleEnum } from '@/lib/constants/role';
import { ROUTES } from '@/lib/routes';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowRight as ArrowRightIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  List as ListIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { Collapse, IconButton, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', path: ROUTES.ADMIN_HOME, icon: <DashboardIcon />, roles: [RoleEnum.ADMIN, RoleEnum.SELLER] },
  { name: 'Users', path: ROUTES.ADMIN_USERS, icon: <PeopleIcon />, roles: [RoleEnum.ADMIN] },
  {
    name: 'Products',
    path: ROUTES.ADMIN_PRODUCTS,
    icon: <InventoryIcon />,
    roles: [RoleEnum.ADMIN],
    // items: [
    //   { name: 'Product List', path: ROUTES.ADMIN_PRODUCTS, icon: <ListIcon /> },
    //   { name: 'Create Product', path: ROUTES.ADMIN_PRODUCTS_CREATE, icon: <AddCircleIcon /> },
    // ],
  },
  { name: 'Orders', path: ROUTES.ADMIN_ORDER, icon: <ReceiptIcon />, roles: [RoleEnum.ADMIN, RoleEnum.SELLER] },
  {
    name: 'Shops',
    path: ROUTES.ADMIN_SHOPS,
    icon: <StoreIcon />,
    roles: [RoleEnum.ADMIN, RoleEnum.SELLER],
    items: [
      { name: 'Shop List', path: ROUTES.ADMIN_SHOPS, icon: <ListIcon /> },
      // { name: 'Create Shop', path: ROUTES.ADMIN_SHOPS_CREATE, icon: <AddCircleIcon /> },
    ],
  },
];

interface SidebarMenuProps {
  isOpen: boolean;
  userRole: RoleEnum;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, userRole }) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleToggleMenu = (name: string) => {
    setOpenMenus((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  return (
    <List>
      {menuItems
        .filter((item) => item.roles.includes(userRole as RoleEnum))
        .map((item) => (
          <React.Fragment key={item.name}>
            <ListItem
              component={Link}
              href={item.path}
              sx={{
                backgroundColor: pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: '#ffffff',
                border: '1px solid transparent',
                borderRadius: '8px',
                margin: '4px 0',
                padding: '8px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: '#334155' },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>{item.icon}</ListItemIcon>
              {isOpen && <ListItemText primary={item.name} />}
              {isOpen && item.items && (
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleMenu(item.name);
                  }}
                  sx={{ color: '#ffffff', ml: 'auto' }}
                >
                  {openMenus.includes(item.name) ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </IconButton>
              )}
            </ListItem>
            {item.items && (
              <Collapse in={isOpen && openMenus.includes(item.name)} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {item.items.map((subItem) => (
                    <ListItem
                      key={subItem.name}
                      component={Link}
                      href={subItem.path}
                      sx={{
                        pl: 4,
                        backgroundColor: pathname === subItem.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: '#ffffff',
                        border: '1px solid transparent',
                        borderRadius: '8px',
                        padding: '8px',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: '#334155' },
                      }}
                    >
                      <ListItemIcon sx={{ color: '#ffffff' }}>{subItem.icon}</ListItemIcon>
                      {isOpen && <ListItemText primary={subItem.name} />}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
    </List>
  );
};

export default SidebarMenu;
