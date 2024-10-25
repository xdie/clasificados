import React from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ busqueda, setBusqueda }) => {
  return (
    <TextField
      label="Buscar Avisos"
      variant="outlined"
      fullWidth
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      style={{ marginBottom: '20px' }}
    />
  );
};

export default SearchBar;
