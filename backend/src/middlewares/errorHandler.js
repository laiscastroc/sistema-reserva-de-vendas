import { ApiError } from "../utils/ApiError.js";
import { isProduction } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
  });
}

/*detalhes internos não são vazados (stack trace, mensagem de driver do banco)*/
export function errorHandler(err, req, res, next) {
  if(err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details ?? undefined,
    });
  }
  console.error("[error]", err);

  res.status(500).json({
    error: "Erro interno do servidor",
    ...(isProduction ? {} : { detail: err.message }),
  });
}
