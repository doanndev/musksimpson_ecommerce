import { type OrderFilter, OrderStatusEnum } from '@/api/orders/type';
import { FilterAltOutlined as FilterIcon, RestartAlt as ResetIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

interface Props {
  filters: OrderFilter;
  setFilters: (filters: OrderFilter) => void;
  showReset: boolean;
  onReset: () => void;
}

const SearchBar = ({ filters, setFilters, showReset, onReset }: Props) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
      <Stack direction='row' gap={1} alignItems='center'>
        <TextField
          label='Search'
          placeholder='Search orders...'
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          size='small'
          InputProps={{
            startAdornment: <SearchIcon color='action' sx={{ mr: 1 }} />,
          }}
          sx={{ width: '350px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          variant='outlined'
        />
        <FormControl size='small' sx={{ width: '150px' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as OrderStatusEnum | null })}
            label='Status'
            sx={{ borderRadius: '12px' }}
            startAdornment={<FilterIcon sx={{ mr: 1, color: 'action' }} />}
          >
            <MenuItem value={OrderStatusEnum.ALL} selected>
              All
            </MenuItem>
            <MenuItem value={OrderStatusEnum.PENDING}>PENDING</MenuItem>
            <MenuItem value={OrderStatusEnum.PROCESSING}>PROCESSING</MenuItem>
            <MenuItem value={OrderStatusEnum.SHIPPING}>SHIPPING</MenuItem>
            <MenuItem value={OrderStatusEnum.DELIVERED}>DELIVERED</MenuItem>
            <MenuItem value={OrderStatusEnum.CANCELLED}>CANCELLED</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {showReset && (
        <IconButton onClick={onReset} color='inherit'>
          <ResetIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchBar;
