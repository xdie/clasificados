import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Servir la carpeta de uploads para acceder a las imágenes y thumbnails
app.use('/uploads', express.static('uploads'));


// Conexión a MongoDB
mongoose.connect('mongodb://mongo:27017/avisosdb', {})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Configuración de Multer para cargar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/images';
    fs.mkdirsSync(uploadPath);  // Asegurarse de que la carpeta exista
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Definir el esquema y modelo para los avisos
const avisoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  telefono: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  etiqueta: { type: String, default: '' },
  precio: { type: Number, default: 0 },
  fotos: [String],  // Almacena las rutas de las imágenes
});

const Aviso = mongoose.model('Aviso', avisoSchema);

// Endpoint para subir imágenes y crear thumbnails
app.post('/upload', upload.array('fotos', 5), async (req, res) => {
    try {
      const imagePaths: { original: string, thumbnail: string }[] = [];
  
      // Asegúrate de que req.files no sea undefined
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No se encontraron archivos' });
      }
      
      console.log('Archivos recibidos:', req.files);  // Log para verificar los archivos

      // Crear la carpeta de thumbnails si no existe
      const thumbnailDir = 'uploads/thumbnails';
      fs.mkdirsSync(thumbnailDir); // Crear la carpeta de thumbnails si no existe
  
      // Iterar sobre req.files de manera segura
      for (const file of req.files as Express.Multer.File[]) {
        const thumbnailPath = path.join(thumbnailDir, `thumb-${file.filename}`);
        console.log('Procesando thumbnail para:', file.filename);  // Log para seguimiento

        // Crear el thumbnail usando Sharp
        await sharp(file.path)
          .resize(200, 200) // Crear una miniatura de 200x200 px
          .toFile(thumbnailPath);

        imagePaths.push({
          original: file.path,
          thumbnail: thumbnailPath
        });
      }
  
      res.json({ images: imagePaths });
    } catch (error) {
      console.error('Error al procesar las imágenes:', error);
      res.status(500).json({ message: 'Error al cargar las imágenes' });
    }
});


// Endpoint para crear un aviso
app.post('/avisos', async (req, res) => {
  const { titulo, telefono, descripcion, categoria, precio, fotos } = req.body;
  
  try {
    const nuevoAviso = new Aviso({ titulo, telefono, descripcion, categoria, precio, fotos });
    await nuevoAviso.save();
    res.status(201).json(nuevoAviso);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el aviso' });
  }
});

// **Nuevo**: Endpoint para obtener todos los avisos
app.get('/avisos', async (req, res) => {
  try {
    const avisos = await Aviso.find();
    res.json(avisos);
  } catch (error) {
    console.error('Error al obtener los avisos:', error);
    res.status(500).json({ message: 'Error al obtener los avisos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


