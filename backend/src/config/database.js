import { Pool } from "pg";
import { env, isProduction } from "./env.js";

//usa-se um pool (várias conexões) para que possíveis
//requisições simultâneas utilizem conexões já abertas
//invés de abrir uma nova conexão a cada requisição.

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

//tratamento de erro para caso brote algo disparar no log
pool.on("error", (error) => {
  console.error("[database] erro inesperado em conexão ociosa do pool:", error);
});

//evitar sql injection
export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);

  if (!isProduction) {
    console.log(`[db] ${text.replace(/\s+/g, " ").trim()} (${Date.now() - start}ms)`);
  }
  return result;
}

//tudo ou nada, se der erro em algum ponto, volta tudo
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
