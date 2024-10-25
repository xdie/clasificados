import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, InputLabel, FormControl, LinearProgress } from '@mui/material';
import Slider from 'react-slick';
import { useDropzone } from 'react-dropzone';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PhoneIcon from '@mui/icons-material/Phone'; // Icono de teléfono
import DeleteIcon from '@mui/icons-material/Delete'; // Icono de cesto de basura

interface Aviso {
  id: string;
  titulo: string;
  telefono: string;
  descripcion: string;
  categoria: string;
  etiqueta: string;
  fotos: string[]; // Ruta de imágenes
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

const App: React.FC = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisosFiltrados, setAvisosFiltrados] = useState<Aviso[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [avisoSeleccionado, setAvisoSeleccionado] = useState<Aviso | null>(null);
  const [nuevoAviso, setNuevoAviso] = useState({ titulo: '', telefono: '', descripcion: '', categoria: '', etiqueta: '' });
  const [busqueda, setBusqueda] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  // Obtener los avisos desde la API
  const obtenerAvisos = () => {
    axios
      .get('http://localhost:4000/avisos')
      .then((response) => {
        setAvisos(response.data);
        setAvisosFiltrados(response.data); // Inicialmente mostrar todos los avisos
      })
      .catch((error) => {
        console.error('Error al obtener los avisos:', error);
      });
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const agregarAviso = async () => {
    if (subiendo) return; // Evita múltiples clics mientras suben las imágenes

    const formData = new FormData();
    imagenes.forEach((file) => {
      formData.append('fotos', file);
    });

    setSubiendo(true); // Activar estado de subida
    setProgreso(0); // Reiniciar progreso

    try {
      // Enviar las imágenes al backend con seguimiento de progreso
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const porcentaje = Math.round((event.loaded * 100) / event.total);
            setProgreso(porcentaje);
          }
        }
      });

      const fotos = response.data.images.map((img: any) => img.thumbnail);

      // Crear el aviso con las rutas de las fotos
      const nuevoAvisoData = await axios.post('http://localhost:4000/avisos', {
        ...nuevoAviso,
        fotos,
      });

      setAvisos([...avisos, nuevoAvisoData.data]);
      setAvisosFiltrados([...avisos, nuevoAvisoData.data]);
      setMostrarFormulario(false);
      setNuevoAviso({ titulo: '', telefono: '', descripcion: '', categoria: '', etiqueta: '' });
      setImagenes([]);
      setPreview([]);
    } catch (error) {
      console.error('Error al agregar el aviso:', error);
    } finally {
      setSubiendo(false); // Desactivar estado de subida
      setProgreso(0); // Reiniciar progreso
    }
  };

  const filtrarAvisos = (textoBusqueda: string) => {
    setBusqueda(textoBusqueda);
    const avisosFiltrados = avisos.filter(aviso =>
      (aviso.titulo || '').toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      (aviso.telefono || '').toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      (aviso.descripcion || '').toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      (aviso.categoria || '').toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    setAvisosFiltrados(avisosFiltrados);
  };

  const verDetallesAviso = (aviso: Aviso) => {
    setAvisoSeleccionado(aviso);
    setMostrarDetalles(true);
  };

  // Filtrar los avisos destacados
  const avisosDestacados = avisos.filter(aviso => aviso.etiqueta === 'destacado');

  const settings = {
    dots: true,
    infinite: avisosDestacados.length > 3,  // Infinite loop solo si hay más de 3 destacados
    speed: 500,
    slidesToShow: avisosDestacados.length < 3 ? avisosDestacados.length : 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: avisosDestacados.length < 2 ? avisosDestacados.length : 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Usar Dropzone para manejar las imágenes de arrastrar y soltar
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    onDrop: (acceptedFiles) => {
      setImagenes([...imagenes, ...acceptedFiles]); // Agregar nuevas imágenes
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreview([...preview, ...previews]); // Actualizar previsualización
    }
  });

  // Función para eliminar una imagen por índice
  const eliminarImagen = (index: number) => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);

    const nuevasPreviews = [...preview];
    nuevasPreviews.splice(index, 1);
    setPreview(nuevasPreviews);
  };

  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h2" align="center" gutterBottom>
        Avisos Clasificados
      </Typography>

      <TextField
        label="Buscar Avisos"
        variant="outlined"
        fullWidth
        value={busqueda}
        onChange={(e) => filtrarAvisos(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => setMostrarFormulario(true)}
        style={{ marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Agregar Aviso
      </Button>

      {/* Slider de avisos destacados */}
      <Typography variant="h4" align="center" gutterBottom>
        Avisos Destacados
      </Typography>
      <Slider {...settings}>
        {avisosDestacados.map((aviso) => (
          <Card key={aviso.id} style={{ margin: '15px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              {/* Mostrar thumbnail */}
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
        ))}
      </Slider>

      {/* Dialog para agregar nuevo aviso */}
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
          
          {/* Seleccionar Categoría */}
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

          {/* Campo para etiqueta */}
          <TextField
            margin="dense"
            label="Etiqueta (e.g., destacado)"
            fullWidth
            value={nuevoAviso.etiqueta}
            onChange={(e) => setNuevoAviso({ ...nuevoAviso, etiqueta: e.target.value })}
          />

          {/* Área de arrastrar y soltar para imágenes */}
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

      {/* Dialog para mostrar detalles del aviso */}
      {avisoSeleccionado && (
        <Dialog
          open={mostrarDetalles}
          onClose={() => setMostrarDetalles(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Detalles del Aviso</DialogTitle>
          <DialogContent>
            <Typography variant="h4" gutterBottom>{avisoSeleccionado.titulo}</Typography>
            <Typography variant="subtitle1" gutterBottom>Teléfono: {avisoSeleccionado.telefono}</Typography>
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              {avisoSeleccionado.descripcion}
            </Typography>
            {/* Mostrar la imagen en los detalles del aviso */}
            {avisoSeleccionado.fotos && avisoSeleccionado.fotos.length > 0 && (
              <img 
                src={`http://localhost:4000/${avisoSeleccionado.fotos[0]}`} 
                alt={avisoSeleccionado.titulo} 
                style={{ width: '100%', height: '400px', objectFit: 'cover', marginTop: '20px' }} 
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMostrarDetalles(false)} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Grid para mostrar todos los avisos */}
      <Grid container spacing={3}>
        {avisosFiltrados.map((aviso) => (
          <Grid item xs={12} sm={6} md={4} key={aviso.id}>
            <Card style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                {/* Mostrar thumbnail */}
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
