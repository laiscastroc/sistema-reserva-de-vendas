import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

//runner de migrações simples de cada arquivo .sql
//da asta migrations. cada um é idempotente:
//pode ser rodado várias vezes sem quebrar nada.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "migrations");

async function run() {
  if(!process.env.DATABASE_URL) {
    console.error("DATABASE_URL não definida. Configure o arquivo .env antes de migrar.");
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Aplicando ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await client.query(sql);
    console.log(`${file} aplicada com sucesso`);
  }
  await client.end();
  console.log("Migrações concluídas.");
}
run().catch((error) => {
  console.error("Erro ao rodar migrações:", error);
  process.exit(1);
});
