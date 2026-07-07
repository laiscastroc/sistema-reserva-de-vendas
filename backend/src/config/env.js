import "dotenv/config";

const requiredVars = ["DATABASE_URL"];

for(const key of requiredVars) {
  if(!process.env[key]) {
    throw new Error(
      `Variável de ambiente obrigatória "${key}" não foi definida. Confira o arquivo .env (veja .env.example).`
    );
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigins: (process.env.FRONTEND_URL ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export const isProduction = env.nodeEnv === "production";
