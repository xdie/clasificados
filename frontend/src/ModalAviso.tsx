import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, Typography } from '@mui/material';

interface ModalAvisoProps {
  aviso: {
    titulo: string;
    telefono: string;
    descripcion: string;
    fotos: string[];
  } | null;
  isOpen: boolean;
  handleClose: () => void;
}

const ModalAviso: React.FC<ModalAvisoProps> = ({ aviso, isOpen, handleClose }) => {
  if (!aviso) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalles del Aviso</DialogTitle>
      <DialogContent>
        <Typography variant="h4" gutterBottom>{aviso.titulo}</Typography>
        <Typography variant="subtitle1" gutterBottom>Teléfono: {aviso.telefono}</Typography>
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          {aviso.descripcion}
        </Typography>
        {aviso.fotos && aviso.fotos.length > 0 && (
          <img 
            src={`http://localhost:4000/${aviso.fotos[0]}`} 
            alt={aviso.titulo} 
            style={{ width: '100%', height: '400px', objectFit: 'cover', marginTop: '20px' }} 
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAviso;
