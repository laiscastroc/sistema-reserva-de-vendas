import { z } from "zod";

export const dashboardQuerySchema = z.object({
  // Janela do gráfico de receita diária (em dias)
  days: z.coerce.number().int().min(7).max(180).default(30),
  // A partir de qual quantidade em estoque uma ave entra no alerta de estoque baixo
  lowStockThreshold: z.coerce.number().int().min(0).max(50).default(3),
});
