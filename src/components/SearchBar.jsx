import React from 'react';
import { Box, TextField, InputAdornment, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  filterOptions = [],
  filterValue,
  onFilterChange,
  onReset,
  placeholder = 'Rechercher...'
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        mb: 3
      }}
    >
      <TextField
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 280, flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          )
        }}
      />

      {filterOptions.length > 0 && (
        <TextField
          select
          size="small"
          label="Filtrer"
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" color="action" />
              </InputAdornment>
            )
          }}
        >
          <MenuItem value="ALL">Tous les statuts</MenuItem>
          {filterOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      )}

      {(searchTerm || (filterValue && filterValue !== 'ALL')) && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={onReset}
          sx={{ height: 40 }}
        >
          Réinitialiser
        </Button>
      )}
    </Box>
  );
};
