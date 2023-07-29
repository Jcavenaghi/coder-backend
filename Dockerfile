FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Instalar build-essential para poder compilar bcrypt
RUN apt-get update && apt-get install -y build-essential

# Compilar las dependencias dentro del contenedor
RUN npm rebuild bcrypt --build-from-source

EXPOSE 8080

CMD ["npm", "start"]