import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { env, isProduction } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { ApiError } from "./utils/ApiError.js";

export const app = express();
export { app };
export default app;

app.set("trust proxy", 1);

//cabeçalhos de segurança (proteger contra alguns 
//ataques comuns: sniffing de MIME type, clickjacking, etc
app.use(helmet());
//CORS restrito às origens configuradas em FRONTEND_URL — evita que
//qualquer site chame a API a partir do navegador de um usuário.
app.use(
  cors({
    origin(origin, callback) {
      //requisições sem "origin" (ex: curl, apps mobile, health checks) são permitidas.
      if (!origin || env.frontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new ApiError(403, "Origem não autorizada!"));
    },
    methods: ["GET", "POST", "PATCH"],
  })
);

app.use(compression());
app.use(express.json({ limit: "50kb" })); //evita payloads gigantes propositais
app.use(morgan(isProduction ? "combined" : "dev"));

app.use(generalLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo ao Sistema de Reserva de Vendas",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      birds: "/api/birds",
      sales: "/api/sales",
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
