import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // datasource.url diambil dari DATABASE_URL di environment (schema.prisma)
  // DIRECT_URL hanya dipakai saat prisma migrate secara manual (local dev)
});
