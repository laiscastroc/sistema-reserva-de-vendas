import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/database.js";

const server = app.listen(env.port, () => {
  console.log(`API AvesBrasil rodando!`);
});

/*ao receber um sinal de término (ex: Ctrl+C) ou se o ambiente de 
hospedagem reiniciar o serviço, paramos de aceitar novas conexões 
e fechamos o pool do banco antes de finalizar o processo.*/

function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando servidor...`);
  server.close(async () => {
    await pool.end();
    console.log("Servidor encerrado com sucesso.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
