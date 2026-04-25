FROM node:20-alpine

WORKDIR /app

# Copy package files first for better Docker cache
COPY package*.json ./
COPY prisma.config.ts ./

RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Entrypoint script handles migrations, seed and startup
COPY entrypoint.sh /entrypoint.sh

# Instala o utilitário para converter as quebras de linha (CRLF para LF)
RUN apk add --no-cache dos2unix
RUN dos2unix /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
