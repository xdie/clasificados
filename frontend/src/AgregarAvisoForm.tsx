import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

interface AgregarAvisoFormProps {
  onAvisoAgregado: () => void;
}

const AgregarAvisoForm: React.FC<AgregarAvisoFormProps> = ({ onAvisoAgregado }) => {
  const [titulo, setTitulo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validación básica
    if (!titulo || !telefono || !descripcion) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Enviar datos al backend
    axios
      .post('http://localhost:4000/avisos', {
        titulo,
        telefono,
        descripcion,
      })
      .then((response) => {
        console.log('Aviso agregado:', response.data);
        // Limpiar el formulario
        setTitulo('');
        setTelefono('');
        setDescripcion('');
        // Notificar al componente padre
        onAvisoAgregado();
      })
      .catch((error) => {
        console.error('Error al agregar el aviso:', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Agregar Nuevo Aviso
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default AgregarAvisoForm;
