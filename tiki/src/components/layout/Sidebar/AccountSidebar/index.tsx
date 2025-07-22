'use client';

import { Icons } from '@/assets/icons';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { text: 'Thông báo của tôi', icon: Icons.bell, href: ROUTES.NOTIFICATIONS },
  { text: 'Thông tin tài khoản', icon: Icons.user, href: ROUTES.ACCOUNT_INFO },
  { text: 'Quản lý đơn hàng', icon: Icons.shopping, href: ROUTES.ACCOUNT_ORDERS },
  { text: 'Quản lý đổi trả', icon: Icons.bag, href: ROUTES.ACCOUNT_RETURNS },
  { text: 'Sổ địa chỉ', icon: Icons.location, href: ROUTES.ACCOUNT_ADDRESS },
  { text: 'Thông tin thanh toán', icon: Icons.credit_card, href: ROUTES.ACCOUNT_PAYMENTS },
  { text: 'Đánh giá sản phẩm', icon: Icons.comment, href: ROUTES.ACCOUNT_REVIEWS },
  { text: 'Sản phẩm bạn đã xem', icon: Icons.eye, href: ROUTES.ACCOUNT_VIEWED },
  { text: 'Sản phẩm yêu thích', icon: Icons.heart, href: ROUTES.ACCOUNT_FAVORITES },
  { text: 'Nhận xét của tôi', icon: Icons.star_half, href: ROUTES.ACCOUNT_COMMENTS },
  { text: 'Hỗ trợ khách hàng', icon: Icons.headphone, href: ROUTES.ACCOUNT_SUPPORT },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className='sticky top-10 h-full w-[300px] rounded-2xl bg-white'>
      <div className='p-4'>
        <div className='ml-4 flex items-center space-x-2'>
          <Avatar className='bg-blue-500'>{user?.full_name}</Avatar>
          <span className='font-semibold'>{user?.full_name}</span>
        </div>
        <List>
          {sidebarItems.map(({ text, icon: Icon, href }) => (
            <ListItem
              key={text}
              component={Link}
              href={href}
              className={cn('!gap-2 rounded-md hover:bg-gray-100', pathname === href && 'bg-gray-100')}
            >
              <ListItemIcon className='!min-w-0'>
                <Icon className='text-gray-400' />
              </ListItemIcon>
              <ListItemText className='[&_.MuiListItemText-primary]:!text-sm' primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </aside>
  );
};

export { AccountSidebar };
