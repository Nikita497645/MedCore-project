import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Hardcoding the connection string ensures no weird Base64 characters interfere
    url: "postgresql://medcore_admin:supersecretpassword@localhost:5432/medcore_db?schema=public",
  },
});