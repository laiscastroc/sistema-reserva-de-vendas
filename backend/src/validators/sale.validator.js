import { z } from "zod";
import { isValidCPF } from "../utils/cpf.js";

const cpfSchema = z
  .string()
  .trim()
  .min(11, "CPF deve conter 11 dígitos")
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => value.length === 11, "CPF deve conter 11 dígitos")
  .refine(isValidCPF, "CPF inválido")
  .transform((value) => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

const contactSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => value.length === 10 || value.length === 11, {
    message: "Telefone deve conter DDD + número (10 ou 11 dígitos)",
  })
  .transform((value) =>
    value.length === 11
      ? value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  );

export const createSaleSchema = z.object({
  bird_id: z.coerce.number().int().positive("Selecione uma ave válida"),
  gender: z.enum(["Macho", "Fêmea"], {
    errorMap: () => ({ message: "Gênero deve ser Macho ou Fêmea" }),
  }),
  quantity: z.coerce.number().int().min(1, "Quantidade mínima é 1").max(50, "Quantidade máxima é 50"),
  buyer_name: z
    .string()
    .trim()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(150, "Nome muito longo")
    .regex(/^[\p{L}\s'.-]+$/u, "Nome deve conter apenas letras"),
  cpf: cpfSchema,
  contact: contactSchema,
  payment_method: z.enum(["Pix", "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Transferência"], {
    errorMap: () => ({ message: "Forma de pagamento inválida" }),
  }),
  status: z.enum(["VENDA", "RESERVA"], {
    errorMap: () => ({ message: "Status deve ser VENDA ou RESERVA" }),
  }),
  include_legalization: z.coerce.boolean().default(true),
});

export const listSalesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["VENDA", "RESERVA", "CANCELADA"]).optional(),
  bird_id: z.coerce.number().int().positive().optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("Identificador inválido"),
});
