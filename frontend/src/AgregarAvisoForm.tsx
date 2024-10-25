import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Button, LinearProgress, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';

interface AgregarAvisoFormProps {
  nuevoAviso: { titulo: string, telefono: string, descripcion: string, categoria: string, etiqueta: string };
  setNuevoAviso: React.Dispatch<React.SetStateAction<{ titulo: string, telefono: string, descripcion: string, categoria: string, etiqueta: string }>>;
  agregarAviso: () => void;
  subiendo: boolean;
  progreso: number;
  mostrarFormulario: boolean;
  setMostrarFormulario: React.Dispatch<React.SetStateAction<boolean>>;
  imagenes: File[];
  setImagenes: React.Dispatch<React.SetStateAction<File[]>>;
  preview: string[];
  setPreview: React.Dispatch<React.SetStateAction<string[]>>;
}

const categorias = [
  'Compra Venta',
  'Autos, Motos, Otros',
  'Trabajo y Empleo',
  'Encuentros',
  'Comunidad',
  'Inmuebles',
  'Servicios',
  'Otros'
];

const AgregarAvisoForm: React.FC<AgregarAvisoFormProps> = ({ nuevoAviso, setNuevoAviso, agregarAviso, subiendo, progreso, mostrarFormulario, setMostrarFormulario, imagenes, setImagenes, preview, setPreview }) => {

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    onDrop: (acceptedFiles) => {
      setImagenes([...imagenes, ...acceptedFiles]);
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreview([...preview, ...previews]);
    }
  });

  const eliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);

    const nuevasPreviews = [...preview];
    nuevasPreviews.splice(index, 1);
    setPreview(nuevasPreviews);
  };

  return (
    <Dialog open={mostrarFormulario} onClose={() => setMostrarFormulario(false)}>
      <DialogTitle>Agregar Nuevo Aviso</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          value={nuevoAviso.titulo}
          onChange={(e) => setNuevoAviso({ ...nuevoAviso, titulo: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Teléfono"
          fullWidth
          value={nuevoAviso.telefono}
          onChange={(e) => setNuevoAviso({ ...nuevoAviso, telefono: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          rows={3}
          value={nuevoAviso.descripcion}
          onChange={(e) => setNuevoAviso({ ...nuevoAviso, descripcion: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Categoría</InputLabel>
          <Select
            value={nuevoAviso.categoria}
            onChange={(e) => setNuevoAviso({ ...nuevoAviso, categoria: e.target.value as string })}
          >
            {categorias.map(categoria => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Etiqueta (e.g., destacado)"
          fullWidth
          value={nuevoAviso.etiqueta}
          onChange={(e) => setNuevoAviso({ ...nuevoAviso, etiqueta: e.target.value })}
        />

        {/* Drag-and-drop de imágenes */}
        <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          <Typography variant="body1">Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionarlas</Typography>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
          {preview.map((src, index) => (
            <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
              <img src={src} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                onClick={() => eliminarImagen(index)} 
                style={{ position: 'absolute', bottom: 0, right: 0 }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
        </div>

        {/* Barra de progreso */}
        {subiendo && <LinearProgress variant="determinate" value={progreso} style={{ marginTop: '20px' }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setMostrarFormulario(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={agregarAviso} color="primary" disabled={subiendo}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarAvisoForm;
