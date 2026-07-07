import { ApiError } from "../utils/ApiError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if(!result.success) {
      const details = result.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      }));
      return next(ApiError.badRequest("Dados inválidos", details));
    }
    req[source] = result.data;
    next();
  };
}
