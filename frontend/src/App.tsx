import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Grid, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SearchBar from './SearchBar';
import AvisoCard from './AvisoCard';
import ModalAviso from './ModalAviso';
import AgregarAvisoForm from './AgregarAvisoForm';

interface Aviso {
  id: string;
  titulo: string;
  telefono: string;
  descripcion: string;
  categoria: string;
  etiqueta: string;
  fotos: string[];
}

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

  const obtenerAvisos = () => {
    axios
      .get('http://localhost:4000/avisos')
      .then((response) => {
        setAvisos(response.data);
        setAvisosFiltrados(response.data);
      })
      .catch((error) => console.error('Error al obtener los avisos:', error));
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const agregarAviso = async () => {
    if (subiendo) return;

    const formData = new FormData();
    imagenes.forEach((file) => {
      formData.append('fotos', file);
    });

    setSubiendo(true);
    setProgreso(0);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const porcentaje = Math.round((event.loaded * 100) / event.total);
            setProgreso(porcentaje);
          }
        }
      });

      const fotos = response.data.images.map((img: any) => img.thumbnail);
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
      setSubiendo(false);
      setProgreso(0);
    }
  };

  const filtrarAvisos = (textoBusqueda: string) => {
    setBusqueda(textoBusqueda);
    const avisosFiltrados = avisos.filter(aviso =>
      (aviso.titulo || '').toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      (aviso.telefono || '').toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      (aviso.descripcion || '').toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    setAvisosFiltrados(avisosFiltrados);
  };

  const verDetallesAviso = (aviso: Aviso) => {
    setAvisoSeleccionado(aviso);
    setMostrarDetalles(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h2" align="center" gutterBottom>
        Avisos Clasificados
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setMostrarFormulario(true)}
        style={{ marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Agregar Aviso
      </Button>

      <SearchBar busqueda={busqueda} setBusqueda={filtrarAvisos} />

      <Typography variant="h4" align="center" gutterBottom>
        Avisos Destacados
      </Typography>
      <Slider {...settings}>
        {avisosFiltrados.slice(0, 5).map((aviso) => (
          <AvisoCard key={aviso.id} aviso={aviso} verDetallesAviso={verDetallesAviso} />
        ))}
      </Slider>

      <AgregarAvisoForm
        nuevoAviso={nuevoAviso}
        setNuevoAviso={setNuevoAviso}
        agregarAviso={agregarAviso}
        imagenes={imagenes}
        setImagenes={setImagenes}
        preview={preview}
        setPreview={setPreview}
        subiendo={subiendo}
        progreso={progreso}
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={setMostrarFormulario}
      />

      <Grid container spacing={3}>
        {avisosFiltrados.map((aviso) => (
          <Grid item xs={12} sm={6} md={4} key={aviso.id}>
            <AvisoCard aviso={aviso} verDetallesAviso={verDetallesAviso} />
          </Grid>
        ))}
      </Grid>

      <ModalAviso aviso={avisoSeleccionado} isOpen={mostrarDetalles} handleClose={() => setMostrarDetalles(false)} />
    </Container>
  );
};

export default App;
