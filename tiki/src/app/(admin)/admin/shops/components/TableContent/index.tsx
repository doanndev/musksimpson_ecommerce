import type { ShopResponseType } from '@/api/shop/type';
import { ROUTES } from '@/lib/routes';
import { ArrowForwardRounded, CreateOutlined } from '@mui/icons-material';
import { Avatar, Checkbox, IconButton, Stack, TableBody, TableCell, TableRow } from '@mui/material';
import Link from 'next/link';

interface TableContentProps {
  shops: ShopResponseType[];
  selectedItems: string[];
  onSelectItem: (shopId: string) => void;
}

const TableContent = ({ shops, selectedItems, onSelectItem }: TableContentProps) => (
  <TableBody>
    {shops.map((shop: any) => (
      <TableRow key={shop.uuid} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selectedItems.includes(shop.uuid)} onChange={() => onSelectItem(shop.uuid)} />
        </TableCell>
        <TableCell>
          <Stack direction='row' alignItems='center' gap={2}>
            <Avatar src={shop.logo || '/default-shop.png'} sx={{ width: 40, height: 40, borderRadius: '8px' }} />
            <Link href={ROUTES.ADMIN_SHOPS + `/${shop.uuid}`} className='text-blue-600 hover:underline'>
              {shop.name}
            </Link>
          </Stack>
        </TableCell>
        <TableCell>{shop.stock || 0}</TableCell>
        <TableCell>{shop.purchases || 0}</TableCell>
        <TableCell>{shop.is_active ? 'Active' : 'Inactive'}</TableCell>
        <TableCell>
          <IconButton color='inherit' component={Link} href={ROUTES.ADMIN_SHOPS + `/${shop.uuid}/edit`}>
            <CreateOutlined />
          </IconButton>
          <IconButton color='inherit' component={Link} href={ROUTES.ADMIN_SHOPS + `/${shop.uuid}`}>
            <ArrowForwardRounded />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

export default TableContent;
