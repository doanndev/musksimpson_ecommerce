import type { ShopResponseType } from '@/api/shop/type';
import { Checkbox, IconButton, Stack, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface TableHeaderProps {
  selectedItems: string[];
  shops: ShopResponseType[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (column: string) => void;
  onDelete: () => void;
}

const TableHeader = ({ selectedItems, shops, sortBy, sortOrder, onSelectAll, onSort, onDelete }: TableHeaderProps) => (
  <TableHead>
    <TableRow>
      <TableCell padding='checkbox'>
        <Checkbox checked={selectedItems.length === shops.length && shops.length > 0} onChange={onSelectAll} />
      </TableCell>
      {selectedItems.length > 0 ? (
        <>
          <TableCell style={{ padding: '10px 12px' }}>
            <Stack gap={1} direction='row' alignItems='center'>
              <Typography mr={1}>Đã chọn {selectedItems.length}</Typography>
              <Typography>|</Typography>
              <IconButton color='inherit' onClick={onDelete}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Stack>
          </TableCell>
          <TableCell style={{ padding: 0 }} />
          <TableCell style={{ padding: 0 }} />
          <TableCell style={{ padding: 0 }} />
          <TableCell style={{ padding: '10px 16px', textAlign: 'center' }} />
        </>
      ) : (
        <>
          <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
              active={sortBy === 'name'}
              direction={sortBy === 'name' ? sortOrder : 'asc'}
              onClick={() => onSort('name')}
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
              active={sortBy === 'stock'}
              direction={sortBy === 'stock' ? sortOrder : 'asc'}
              onClick={() => onSort('stock')}
            >
              Stock
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
              active={sortBy === 'purchases'}
              direction={sortBy === 'purchases' ? sortOrder : 'asc'}
              onClick={() => onSort('purchases')}
            >
              Purchases
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
              active={sortBy === 'is_active'}
              direction={sortBy === 'is_active' ? sortOrder : 'asc'}
              onClick={() => onSort('is_active')}
            >
              Status
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        </>
      )}
    </TableRow>
  </TableHead>
);

export default TableHeader;
