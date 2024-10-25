import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

interface AvisoCardProps {
  aviso: {
    id: string;
    titulo: string;
    telefono: string;
    descripcion: string;
    fotos: string[];
  };
  verDetallesAviso: (aviso: any) => void;
}

const AvisoCard: React.FC<AvisoCardProps> = ({ aviso, verDetallesAviso }) => {
  return (
    <Card style={{ margin: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        {aviso.fotos && aviso.fotos.length > 0 && (
          <img 
            src={`http://localhost:4000/${aviso.fotos[0]}`} 
            alt={aviso.titulo} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
          />
        )}
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
          {aviso.titulo}
        </Typography>
        <Typography color="textSecondary" style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon style={{ marginRight: '8px' }} />
          {aviso.telefono}
        </Typography>
        <Typography variant="body2" style={{ marginTop: '10px', color: '#666' }}>
          {aviso.descripcion}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => verDetallesAviso(aviso)}>
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
};

export default AvisoCard;
