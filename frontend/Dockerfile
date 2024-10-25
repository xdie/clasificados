# Usar la última versión estable de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Instalar 'serve' para servir la aplicación
RUN npm install -g serve

# Exponer el puerto
EXPOSE 3000

# Comando para correr la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
