# Usar la imagen de Node.js en Debian (bullseye-slim)
FROM node:20-bullseye-slim

# Instalar dependencias para Sharp
RUN apt-get update && apt-get install -y \
  libc6 \
  libvips-dev \
  gcc \
  g++ \
  make \
  python3 \
  && rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el resto del código
COPY . .

# Instalar dependencias con permisos elevados y reconstruir sharp
RUN npm install --unsafe-perm --include=optional

# Reconstruir sharp
RUN npm rebuild sharp

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 4000

# Comando para correr la aplicación
CMD ["npm", "start"]
