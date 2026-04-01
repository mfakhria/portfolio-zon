FROM node:20-alpine

WORKDIR /app

# Install dependencies first so Docker can reuse this layer when source files change.
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy application source and build the Nest app plus Prisma seed script.
COPY . .
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir dist --rootDir . --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck true

EXPOSE 3001

CMD ["node", "dist/main.js"]
