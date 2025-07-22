import { FilterAltOutlined as FilterIcon, RestartAlt as ResetIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  showReset: boolean;
  onReset: () => void;
}

const SearchBar = ({ search, setSearch, filterStatus, setFilterStatus, showReset, onReset }: Props) => (
  <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
    <Stack direction='row' gap={1} alignItems='center'>
      <TextField
        label='Search'
        placeholder='Search shops...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          label='Status'
          sx={{ borderRadius: '12px' }}
          startAdornment={<FilterIcon sx={{ mr: 1, color: 'action' }} />}
        >
          <MenuItem value='' selected>
            All
          </MenuItem>
          <MenuItem value='ACTIVE'>Active</MenuItem>
          <MenuItem value='INACTIVE'>Inactive</MenuItem>
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

export default SearchBar;
