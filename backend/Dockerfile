FROM node:20-alpine

WORKDIR /app

# Install dependencies (all — ts-node needed for seeding)
COPY package*.json ./
# Copy prisma schema + config before install so postinstall (prisma generate) works
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# Copy remaining source
COPY . .

# Build app (src/ → dist/main.js)
RUN npm run build
# Compile seed.ts → dist/prisma/seed.js
RUN npx tsc prisma/seed.ts --outDir dist --rootDir . --module commonjs --target ES2021 --esModuleInterop true --skipLibCheck true
# Remove compiled prisma.config.js artifacts — Prisma CLI loads .ts directly
RUN rm -f prisma.config.js prisma.config.d.ts prisma.config.js.map

EXPOSE 3001

CMD ["node", "dist/main.js"]

