import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15min
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em alguns minutos." },
});

export const createSaleLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10min
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas de registro em pouco tempo. Aguarde alguns minutos.",
  },
});
